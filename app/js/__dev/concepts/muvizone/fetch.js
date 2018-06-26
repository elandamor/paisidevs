/*
 * @class: Fetch
 * Purpose: For the Fetch-API required to fetch data from server.
 */
class Fetch {
    constructor( url, opts ) {
        this.url  = url;
        this.opts = opts;
    }

    xhr() {
        return new Promise( ( resolve, reject ) => {
            let req = new XMLHttpRequest();

            req.open( `${this.opts.method}`, this.url, true);
            req.setRequestHeader("Content-Type", "application/json; charset=UTF-8");

            req.onload = _ => {
                if (req.status == 200) 
                {
                    resolve(req.response);
                } else {
                    reject(Error(req.statusText));
                }
            }

            // Handle network errors
            req.onerror = _ => {
              reject(Error("Network Error"));
            };

            // Make the request
            req.send(`${this.opts.body}`); 
        });
    }

    api() {
        return new Promise( ( resolve, reject ) => {
            if ( Modernizr.fetch ) {
                fetch( this.url ).then( ( response ) => {
                  return response.json();
                }).then( ( data ) => {
                    resolve(data);
                }).catch( ( err ) => {
                    reject(Error('Fetch failed...'));
                })
            } else {
                this.xhr().then( ( response ) => {
                    return JSON.parse(response);
                }).then( ( data ) => {
                    resolve(data);
                }).catch( ( err ) => {
                    reject(Error('Fetch failed...'));
                })
            }                    
        });
    }

    data() {
        return new Promise( ( resolve, reject ) => {
            this.api().then( ( data ) => {
                resolve(data);
            }).catch((error) => {
                reject(Error('Request for data failed...'));
            });
        });
    }
}