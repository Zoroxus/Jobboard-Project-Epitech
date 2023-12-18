# Notes for the front

## Bootstrap

The front uses bootstrap. It's installed by npm. To install it in a new dev environment : 
```bash
npm install
```

### Cards for job offers

```html
<div class="col-md-12 col-xxl-6">
              <div class="card my-3">
                <div class="card-header"><img src="./logo.png" height="16"></div>
                <div class="card-body">
                  <h5 class="card-title">Job offer 2</h5>
                  <p class="card-text">This is the description for this job offer !</p>
                  <a href="#" class="btn btn-primary">Learn more</a>
                  <a href="#" class="btn btn-primary">Apply</a>
                </div>
              </div>
            </div>
```

### To use the api :

With JS :
POST
GET
PUT
DELETE