const http = require('http')

function expressInternal() {

    const routes = {
        GET : {},
        POST : {},
    }

    const app = {
        get: (path, handler) => {
            routes.GET[path] = handler
        },
        post: (path, handler) => {
            routes.POST[path] = handler
        },
        listen: (port, callback) => {
            const server = http.createServer((req, res) => {
                const path = req.url
                const method = req.method
            
             
            if (routes[method]  && routes[method][path]  ) {
                routes[method][path](req,res)
            } else {
                console.log('Page not found')
            }
        })

            server.listen(port, callback)
        },
    }
    return app;
}

module.exports = expressInternal