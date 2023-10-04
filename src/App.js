import React from "react";
import { useState, useEffect } from "react";
import axios from 'axios'
import mondaySdk from "monday-sdk-js";


// Usage of mondaySDK example, for more information visit here: https://developer.monday.com/apps/docs/introduction-to-the-sdk/
const monday = mondaySdk();

const App = () => {
  const [context, setContext] = useState();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [invoices, setInvoices] = useState({});
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [redirectUri, setRedirectUri] = useState('');

  useEffect(() => {
    // Notice this method notifies the monday platform that user gains a first value in an app.
    // Read more about it here: https://developer.monday.com/apps/docs/mondayexecute#value-created-for-user/
    monday.execute("valueCreatedForUser");

    // TODO: set up event listeners, Here`s an example, read more here: https://developer.monday.com/apps/docs/mondaylisten/
    monday.listen("context", (res) => {
      setContext(res.data);
    });
  }, []);

  const fetchInvoices = () => {
    axios.get('https://i9j279set4.execute-api.us-east-1.amazonaws.com/prod/invoice')
      .then(response => {
        const fetchedInvoices = response.data;
        setInvoices(fetchedInvoices.invoices);
      })
      .catch(error => {
        console.error('Error fetching invoices:', error);
      });
  };

  const handleAuthorizeClick = () => {
    const frontendHost = window.location.origin;
    // Construct the authorization URL with user-provided credentials
    const authorizationUrl = `https://i9j279set4.execute-api.us-east-1.amazonaws.com/prod/connect?clientId=${encodeURIComponent(clientId)}&clientSecret=${encodeURIComponent(clientSecret)}&redirectUri=${encodeURIComponent(redirectUri)}&frontendHost=${encodeURIComponent(frontendHost)}`;

    // Redirect the user to the authorization URL
    window.location.href = authorizationUrl;
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authorized = urlParams.get('authorized');

    if (authorized === 'true') {
      setIsAuthorized(true);
    }
  }, []);


 

 
  return (
    <div className="container text-center mb-5 mt-5">

      {!isAuthorized ? (
        <div class="mb-5">
          <h2 class="mb-5">Enter Your Xero API Credentials</h2>

          <div class="input-group mb-3 shadow">
            <span class="input-group-text" id="inputGroup-sizing-default">Client Id</span>
            <input
              type="text"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              class="form-control "

            />
          </div>
          <div class="input-group mb-3 shadow">
            <span class="input-group-text" id="inputGroup-sizing-default">Client Secret</span>
            <input
              type="text"
              value={clientSecret}
              onChange={(e) => setClientSecret(e.target.value)}
              class="form-control "

            />
          </div>
          <div class="input-group mb-3 shadow">
            <span class="input-group-text" id="inputGroup-sizing-default">Redirect Uri</span>
            <input
              type="text"
              value={redirectUri}
              onChange={(e) => setRedirectUri(e.target.value)}
              class="form-control "

            />
          </div>
          <button onClick={handleAuthorizeClick} class="btn btn-outline-dark btn-lg">Submit</button>
        </div>
      ) : (
        <div>
          <button className="btn btn-dark btn-lg mb-3" onClick={fetchInvoices}>
            Fetch Invoices
          </button>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Invoice Number</th>
                  <th>Amount Due</th>
                  <th>Reference</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(invoices).map(key => (
                  <tr key={key}>
                    <td>{invoices[key].invoiceNumber}</td>
                    <td>{invoices[key].amountDue}</td>
                    <td>{invoices[key].reference}</td>
                    <td>{invoices[key].status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
