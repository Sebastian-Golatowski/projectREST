export async function fetchToBackend(url, method, headers, body, callback) {
    let response = await fetch(url, { 
        method: method,
        headers: headers,
        body: body
    }).then(response=> {
        
    }).then(resp=> {
        if (callback) {
            callback(resp)
        }
    })
    
}

/*
fetchToBackend('/api/user/register', 'POST', { "Content-Type": "application/json" }, JSON.stringify({
    "username": this.username,
    "password": this.password,
    "secPassword": this.confirmPassword
  }), resp=> {
    
  })
*/