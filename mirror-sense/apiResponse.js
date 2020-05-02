const express = require('express');
const app = express();

app.get('/address/:lat/:long', (req,res) => {
    let address;

    
    if (req.params.lat == 26.8467088 && req.params.long == 80.9461592){
    address = {
        "plus_code" : {
           "compound_code" : "6JH2+HV Purikhera Mustahkam, Uttar Pradesh, India",
           "global_code" : "7MR26JH2+HV"
        },
        "results" : [
           {
              "address_components" : [
                 {
                    "long_name" : "Unnamed Road",
                    "short_name" : "Unnamed Road",
                    "types" : [ "route" ]
                 },
                 {
                    "long_name" : "Unnao",
                    "short_name" : "Unnao",
                    "types" : [ "administrative_area_level_2", "political" ]
                 },
                 {
                    "long_name" : "Uttar Pradesh",
                    "short_name" : "UP",
                    "types" : [ "administrative_area_level_1", "political" ]
                 },
                 {
                    "long_name" : "India",
                    "short_name" : "IN",
                    "types" : [ "country", "political" ]
                 },
                 {
                    "long_name" : "229202",
                    "short_name" : "229202",
                    "types" : [ "postal_code" ]
                 }
              ],
              "formatted_address" : "Unnamed Road, Uttar Pradesh 229202, India",
              "geometry" : {
                 "bounds" : {
                    "northeast" : {
                       "lat" : 26.2343803,
                       "lng" : 80.6082473
                    },
                    "southwest" : {
                       "lat" : 26.2237222,
                       "lng" : 80.6026878
                    }
                 },
                 "location" : {
                    "lat" : 26.2274474,
                    "lng" : 80.6036826
                 },
                 "location_type" : "GEOMETRIC_CENTER",
                 "viewport" : {
                    "northeast" : {
                       "lat" : 26.2343803,
                       "lng" : 80.6082473
                    },
                    "southwest" : {
                       "lat" : 26.2237222,
                       "lng" : 80.6026878
                    }
                 }
              },
              "place_id" : "ChIJxbV1g-tknDkRyCCXE-u-oE0",
              "types" : [ "route" ]
           },
           {
              "address_components" : [
                 {
                    "long_name" : "Purikhera Mustahkam",
                    "short_name" : "Purikhera Mustahkam",
                    "types" : [ "locality", "political" ]
                 },
                 {
                    "long_name" : "Unnao",
                    "short_name" : "Unnao",
                    "types" : [ "administrative_area_level_2", "political" ]
                 },
                 {
                    "long_name" : "Uttar Pradesh",
                    "short_name" : "UP",
                    "types" : [ "administrative_area_level_1", "political" ]
                 },
                 {
                    "long_name" : "India",
                    "short_name" : "IN",
                    "types" : [ "country", "political" ]
                 },
                 {
                    "long_name" : "229202",
                    "short_name" : "229202",
                    "types" : [ "postal_code" ]
                 }
              ],
              "formatted_address" : "Purikhera Mustahkam, Uttar Pradesh 229202, India",
              "geometry" : {
                 "bounds" : {
                    "northeast" : {
                       "lat" : 26.2299101,
                       "lng" : 80.60302999999999
                    },
                    "southwest" : {
                       "lat" : 26.2248199,
                       "lng" : 80.59688989999999
                    }
                 },
                 "location" : {
                    "lat" : 26.2283222,
                    "lng" : 80.6000794
                 },
                 "location_type" : "APPROXIMATE",
                 "viewport" : {
                    "northeast" : {
                       "lat" : 26.2299101,
                       "lng" : 80.60302999999999
                    },
                    "southwest" : {
                       "lat" : 26.2248199,
                       "lng" : 80.59688989999999
                    }
                 }
              },
              "place_id" : "ChIJj1WwmZJknDkR5sVtQctppjM",
              "types" : [ "locality", "political" ]
           },
           {
              "address_components" : [
                 {
                    "long_name" : "229202",
                    "short_name" : "229202",
                    "types" : [ "postal_code" ]
                 },
                 {
                    "long_name" : "Uttar Pradesh",
                    "short_name" : "UP",
                    "types" : [ "administrative_area_level_1", "political" ]
                 },
                 {
                    "long_name" : "India",
                    "short_name" : "IN",
                    "types" : [ "country", "political" ]
                 }
              ],
              "formatted_address" : "Uttar Pradesh 229202, India",
              "geometry" : {
                 "bounds" : {
                    "northeast" : {
                       "lat" : 26.2548113,
                       "lng" : 80.80450429999999
                    },
                    "southwest" : {
                       "lat" : 26.0753083,
                       "lng" : 80.5828995
                    }
                 },
                 "location" : {
                    "lat" : 26.1294588,
                    "lng" : 80.68817179999999
                 },
                 "location_type" : "APPROXIMATE",
                 "viewport" : {
                    "northeast" : {
                       "lat" : 26.2548113,
                       "lng" : 80.80450429999999
                    },
                    "southwest" : {
                       "lat" : 26.0753083,
                       "lng" : 80.5828995
                    }
                 }
              },
              "place_id" : "ChIJwZeeqkx8nDkRXn_SuGH1eTQ",
              "types" : [ "postal_code" ]
           },
           {
              "address_components" : [
                 {
                    "long_name" : "Unnao",
                    "short_name" : "Unnao",
                    "types" : [ "administrative_area_level_2", "political" ]
                 },
                 {
                    "long_name" : "Uttar Pradesh",
                    "short_name" : "UP",
                    "types" : [ "administrative_area_level_1", "political" ]
                 },
                 {
                    "long_name" : "India",
                    "short_name" : "IN",
                    "types" : [ "country", "political" ]
                 }
              ],
              "formatted_address" : "Unnao, Uttar Pradesh, India",
              "geometry" : {
                 "bounds" : {
                    "northeast" : {
                       "lat" : 27.03084,
                       "lng" : 81.05257
                    },
                    "southwest" : {
                       "lat" : 26.1036601,
                       "lng" : 80.04693999999999
                    }
                 },
                 "location" : {
                    "lat" : 26.5761015,
                    "lng" : 80.54384499999999
                 },
                 "location_type" : "APPROXIMATE",
                 "viewport" : {
                    "northeast" : {
                       "lat" : 27.03084,
                       "lng" : 81.05257
                    },
                    "southwest" : {
                       "lat" : 26.1036601,
                       "lng" : 80.04693999999999
                    }
                 }
              },
              "place_id" : "ChIJ74l6VLgVnDkRE7JSaosqOYI",
              "types" : [ "administrative_area_level_2", "political" ]
           },
           {
              "address_components" : [
                 {
                    "long_name" : "Uttar Pradesh",
                    "short_name" : "UP",
                    "types" : [ "administrative_area_level_1", "political" ]
                 },
                 {
                    "long_name" : "India",
                    "short_name" : "IN",
                    "types" : [ "country", "political" ]
                 }
              ],
              "formatted_address" : "Uttar Pradesh, India",
              "geometry" : {
                 "bounds" : {
                    "northeast" : {
                       "lat" : 30.411635,
                       "lng" : 84.6743269
                    },
                    "southwest" : {
                       "lat" : 23.870839,
                       "lng" : 77.0924369
                    }
                 },
                 "location" : {
                    "lat" : 26.8467088,
                    "lng" : 80.9461592
                 },
                 "location_type" : "APPROXIMATE",
                 "viewport" : {
                    "northeast" : {
                       "lat" : 30.411635,
                       "lng" : 84.6743269
                    },
                    "southwest" : {
                       "lat" : 23.870839,
                       "lng" : 77.0924369
                    }
                 }
              },
              "place_id" : "ChIJ0wlKe59OmTkRnSQXNm1HpfY",
              "types" : [ "administrative_area_level_1", "political" ]
           },
           {
              "address_components" : [
                 {
                    "long_name" : "India",
                    "short_name" : "IN",
                    "types" : [ "country", "political" ]
                 }
              ],
              "formatted_address" : "India",
              "geometry" : {
                 "bounds" : {
                    "northeast" : {
                       "lat" : 35.513327,
                       "lng" : 97.39535869999999
                    },
                    "southwest" : {
                       "lat" : 6.4626999,
                       "lng" : 68.1097
                    }
                 },
                 "location" : {
                    "lat" : 20.593684,
                    "lng" : 78.96288
                 },
                 "location_type" : "APPROXIMATE",
                 "viewport" : {
                    "northeast" : {
                       "lat" : 35.513327,
                       "lng" : 97.39535869999999
                    },
                    "southwest" : {
                       "lat" : 6.4626999,
                       "lng" : 68.1097
                    }
                 }
              },
              "place_id" : "ChIJkbeSa_BfYzARphNChaFPjNc",
              "types" : [ "country", "political" ]
           }
        ],
        "status" : "OK"
     }
   }
   else if(req.params.lat == 30.3398 && req.params.long == 76.3869){
      address = {
         "plus_code" : {
            "compound_code" : "89QP+WQ Patiala, Punjab, India",
            "global_code" : "8J2R89QP+WQ"
         },
         "results" : [
            {
               "address_components" : [
                  {
                     "long_name" : "LIBERTY CHOWK",
                     "short_name" : "LIBERTY CHOWK",
                     "types" : []
                  },
                  {
                     "long_name" : "Green View Colony",
                     "short_name" : "Green View Colony",
                     "types" : [ "political", "sublocality", "sublocality_level_1" ]
                  },
                  {
                     "long_name" : "Patiala",
                     "short_name" : "Patiala",
                     "types" : [ "locality", "political" ]
                  },
                  {
                     "long_name" : "Patiala",
                     "short_name" : "Patiala",
                     "types" : [ "administrative_area_level_2", "political" ]
                  },
                  {
                     "long_name" : "Punjab",
                     "short_name" : "PB",
                     "types" : [ "administrative_area_level_1", "political" ]
                  },
                  {
                     "long_name" : "India",
                     "short_name" : "IN",
                     "types" : [ "country", "political" ]
                  },
                  {
                     "long_name" : "147001",
                     "short_name" : "147001",
                     "types" : [ "postal_code" ]
                  }
               ],
               "formatted_address" : "Shop no-1,185/3 sheran wala gate patiala,147001,punjab, NEAR LIBERTY CHOWK, Green View Colony, Patiala, Punjab 147001, India",
               "geometry" : {
                  "location" : {
                     "lat" : 30.33979429999999,
                     "lng" : 76.38689250000002
                  },
                  "location_type" : "GEOMETRIC_CENTER",
                  "viewport" : {
                     "northeast" : {
                        "lat" : 30.34114328029149,
                        "lng" : 76.38824148029153
                     },
                     "southwest" : {
                        "lat" : 30.3384453197085,
                        "lng" : 76.38554351970852
                     }
                  }
               },
               "place_id" : "ChIJS1VVVZUoEDkRFfSqDE7oGzc",
               "plus_code" : {
                  "compound_code" : "89QP+WQ Green View Colony, Patiala, Punjab, India",
                  "global_code" : "8J2R89QP+WQ"
               },
               "types" : [ "establishment", "health", "point_of_interest" ]
            },
            {
               "address_components" : [
                  {
                     "long_name" : "522",
                     "short_name" : "522",
                     "types" : [ "premise" ]
                  },
                  {
                     "long_name" : "SST Nagar",
                     "short_name" : "SST Nagar",
                     "types" : [ "political", "sublocality", "sublocality_level_1" ]
                  },
                  {
                     "long_name" : "Patiala",
                     "short_name" : "Patiala",
                     "types" : [ "locality", "political" ]
                  },
                  {
                     "long_name" : "Patiala",
                     "short_name" : "Patiala",
                     "types" : [ "administrative_area_level_2", "political" ]
                  },
                  {
                     "long_name" : "Punjab",
                     "short_name" : "PB",
                     "types" : [ "administrative_area_level_1", "political" ]
                  },
                  {
                     "long_name" : "India",
                     "short_name" : "IN",
                     "types" : [ "country", "political" ]
                  },
                  {
                     "long_name" : "147001",
                     "short_name" : "147001",
                     "types" : [ "postal_code" ]
                  }
               ],
               "formatted_address" : "522, SST Nagar, Patiala, Punjab 147001, India",
               "geometry" : {
                  "location" : {
                     "lat" : 30.3397809,
                     "lng" : 76.38687969999999
                  },
                  "location_type" : "ROOFTOP",
                  "viewport" : {
                     "northeast" : {
                        "lat" : 30.3411298802915,
                        "lng" : 76.38822868029149
                     },
                     "southwest" : {
                        "lat" : 30.3384319197085,
                        "lng" : 76.38553071970848
                     }
                  }
               },
               "place_id" : "ChIJq6qqquooEDkRaC2mvEMcP5Q",
               "plus_code" : {
                  "compound_code" : "89QP+WQ Patiala, Punjab, India",
                  "global_code" : "8J2R89QP+WQ"
               },
               "types" : [ "street_address" ]
            },
            {
               "address_components" : [
                  {
                     "long_name" : "Rajbaha Road",
                     "short_name" : "Rajbaha Rd",
                     "types" : [ "route" ]
                  },
                  {
                     "long_name" : "Ram Nagar",
                     "short_name" : "Ram Nagar",
                     "types" : [ "political", "sublocality", "sublocality_level_2" ]
                  },
                  {
                     "long_name" : "Manshahia Colony",
                     "short_name" : "Manshahia Colony",
                     "types" : [ "political", "sublocality", "sublocality_level_1" ]
                  },
                  {
                     "long_name" : "Patiala",
                     "short_name" : "Patiala",
                     "types" : [ "locality", "political" ]
                  },
                  {
                     "long_name" : "Patiala",
                     "short_name" : "Patiala",
                     "types" : [ "administrative_area_level_2", "political" ]
                  },
                  {
                     "long_name" : "Punjab",
                     "short_name" : "PB",
                     "types" : [ "administrative_area_level_1", "political" ]
                  },
                  {
                     "long_name" : "India",
                     "short_name" : "IN",
                     "types" : [ "country", "political" ]
                  },
                  {
                     "long_name" : "147001",
                     "short_name" : "147001",
                     "types" : [ "postal_code" ]
                  }
               ],
               "formatted_address" : "Rajbaha Rd, Ram Nagar, Manshahia Colony, Patiala, Punjab 147001, India",
               "geometry" : {
                  "bounds" : {
                     "northeast" : {
                        "lat" : 30.3399291,
                        "lng" : 76.3879843
                     },
                     "southwest" : {
                        "lat" : 30.3377157,
                        "lng" : 76.38640669999999
                     }
                  },
                  "location" : {
                     "lat" : 30.3389058,
                     "lng" : 76.38704729999999
                  },
                  "location_type" : "GEOMETRIC_CENTER",
                  "viewport" : {
                     "northeast" : {
                        "lat" : 30.3401713802915,
                        "lng" : 76.3885444802915
                     },
                     "southwest" : {
                        "lat" : 30.3374734197085,
                        "lng" : 76.38584651970849
                     }
                  }
               },
               "place_id" : "ChIJbz68puooEDkRumWykTzPw94",
               "types" : [ "route" ]
            },
            {
               "address_components" : [
                  {
                     "long_name" : "Green View Colony",
                     "short_name" : "Green View Colony",
                     "types" : [ "political", "sublocality", "sublocality_level_1" ]
                  },
                  {
                     "long_name" : "Patiala",
                     "short_name" : "Patiala",
                     "types" : [ "locality", "political" ]
                  },
                  {
                     "long_name" : "Patiala",
                     "short_name" : "Patiala",
                     "types" : [ "administrative_area_level_2", "political" ]
                  },
                  {
                     "long_name" : "Punjab",
                     "short_name" : "PB",
                     "types" : [ "administrative_area_level_1", "political" ]
                  },
                  {
                     "long_name" : "India",
                     "short_name" : "IN",
                     "types" : [ "country", "political" ]
                  },
                  {
                     "long_name" : "147001",
                     "short_name" : "147001",
                     "types" : [ "postal_code" ]
                  }
               ],
               "formatted_address" : "Green View Colony, Patiala, Punjab 147001, India",
               "geometry" : {
                  "bounds" : {
                     "northeast" : {
                        "lat" : 30.3406879,
                        "lng" : 76.3888929
                     },
                     "southwest" : {
                        "lat" : 30.3356209,
                        "lng" : 76.3835749
                     }
                  },
                  "location" : {
                     "lat" : 30.3386061,
                     "lng" : 76.3857945
                  },
                  "location_type" : "APPROXIMATE",
                  "viewport" : {
                     "northeast" : {
                        "lat" : 30.3406879,
                        "lng" : 76.3888929
                     },
                     "southwest" : {
                        "lat" : 30.3356209,
                        "lng" : 76.3835749
                     }
                  }
               },
               "place_id" : "ChIJJ1TcIsAoEDkRE_jS6KRYsdg",
               "types" : [ "political", "sublocality", "sublocality_level_1" ]
            },
            {
               "address_components" : [
                  {
                     "long_name" : "Patiala",
                     "short_name" : "Patiala",
                     "types" : [ "locality", "political" ]
                  },
                  {
                     "long_name" : "Patiala",
                     "short_name" : "Patiala",
                     "types" : [ "administrative_area_level_2", "political" ]
                  },
                  {
                     "long_name" : "Punjab",
                     "short_name" : "PB",
                     "types" : [ "administrative_area_level_1", "political" ]
                  },
                  {
                     "long_name" : "India",
                     "short_name" : "IN",
                     "types" : [ "country", "political" ]
                  }
               ],
               "formatted_address" : "Patiala, Punjab, India",
               "geometry" : {
                  "bounds" : {
                     "northeast" : {
                        "lat" : 30.4222337,
                        "lng" : 76.4907647
                     },
                     "southwest" : {
                        "lat" : 30.2710766,
                        "lng" : 76.327343
                     }
                  },
                  "location" : {
                     "lat" : 30.3397809,
                     "lng" : 76.38687969999999
                  },
                  "location_type" : "APPROXIMATE",
                  "viewport" : {
                     "northeast" : {
                        "lat" : 30.4222337,
                        "lng" : 76.4907647
                     },
                     "southwest" : {
                        "lat" : 30.2710766,
                        "lng" : 76.327343
                     }
                  }
               },
               "place_id" : "ChIJ3xMzWpMoEDkRf7yQO61WvNU",
               "types" : [ "locality", "political" ]
            },
            {
               "address_components" : [
                  {
                     "long_name" : "147001",
                     "short_name" : "147001",
                     "types" : [ "postal_code" ]
                  },
                  {
                     "long_name" : "India",
                     "short_name" : "IN",
                     "types" : [ "country", "political" ]
                  }
               ],
               "formatted_address" : "147001, India",
               "geometry" : {
                  "bounds" : {
                     "northeast" : {
                        "lat" : 30.5084043,
                        "lng" : 76.4475229
                     },
                     "southwest" : {
                        "lat" : 30.1748043,
                        "lng" : 76.1773661
                     }
                  },
                  "location" : {
                     "lat" : 30.2896414,
                     "lng" : 76.3405733
                  },
                  "location_type" : "APPROXIMATE",
                  "viewport" : {
                     "northeast" : {
                        "lat" : 30.5084043,
                        "lng" : 76.4475229
                     },
                     "southwest" : {
                        "lat" : 30.1748043,
                        "lng" : 76.1773661
                     }
                  }
               },
               "place_id" : "ChIJ0x38y1QuEDkRM1cVIGQh9w0",
               "types" : [ "postal_code" ]
            },
            {
               "address_components" : [
                  {
                     "long_name" : "Patiala",
                     "short_name" : "Patiala",
                     "types" : [ "administrative_area_level_2", "political" ]
                  },
                  {
                     "long_name" : "Punjab",
                     "short_name" : "PB",
                     "types" : [ "administrative_area_level_1", "political" ]
                  },
                  {
                     "long_name" : "India",
                     "short_name" : "IN",
                     "types" : [ "country", "political" ]
                  }
               ],
               "formatted_address" : "Patiala, Punjab, India",
               "geometry" : {
                  "bounds" : {
                     "northeast" : {
                        "lat" : 30.63727,
                        "lng" : 76.81738
                     },
                     "southwest" : {
                        "lat" : 29.79047,
                        "lng" : 75.9229699
                     }
                  },
                  "location" : {
                     "lat" : 30.3098101,
                     "lng" : 76.317414
                  },
                  "location_type" : "APPROXIMATE",
                  "viewport" : {
                     "northeast" : {
                        "lat" : 30.63727,
                        "lng" : 76.81738
                     },
                     "southwest" : {
                        "lat" : 29.79047,
                        "lng" : 75.9229699
                     }
                  }
               },
               "place_id" : "ChIJj8CWU-IoEDkReWJWGW29S_0",
               "types" : [ "administrative_area_level_2", "political" ]
            },
            {
               "address_components" : [
                  {
                     "long_name" : "Punjab",
                     "short_name" : "PB",
                     "types" : [ "administrative_area_level_1", "political" ]
                  },
                  {
                     "long_name" : "India",
                     "short_name" : "IN",
                     "types" : [ "country", "political" ]
                  }
               ],
               "formatted_address" : "Punjab, India",
               "geometry" : {
                  "bounds" : {
                     "northeast" : {
                        "lat" : 32.4994008,
                        "lng" : 76.92175809999999
                     },
                     "southwest" : {
                        "lat" : 29.537147,
                        "lng" : 73.88057999999999
                     }
                  },
                  "location" : {
                     "lat" : 31.1471305,
                     "lng" : 75.34121789999999
                  },
                  "location_type" : "APPROXIMATE",
                  "viewport" : {
                     "northeast" : {
                        "lat" : 32.4994008,
                        "lng" : 76.92175809999999
                     },
                     "southwest" : {
                        "lat" : 29.537147,
                        "lng" : 73.88057999999999
                     }
                  }
               },
               "place_id" : "ChIJVXOeVqpkGTkRYYijAzEmvY8",
               "types" : [ "administrative_area_level_1", "political" ]
            },
            {
               "address_components" : [
                  {
                     "long_name" : "India",
                     "short_name" : "IN",
                     "types" : [ "country", "political" ]
                  }
               ],
               "formatted_address" : "India",
               "geometry" : {
                  "bounds" : {
                     "northeast" : {
                        "lat" : 35.513327,
                        "lng" : 97.39535869999999
                     },
                     "southwest" : {
                        "lat" : 6.4626999,
                        "lng" : 68.1097
                     }
                  },
                  "location" : {
                     "lat" : 20.593684,
                     "lng" : 78.96288
                  },
                  "location_type" : "APPROXIMATE",
                  "viewport" : {
                     "northeast" : {
                        "lat" : 35.513327,
                        "lng" : 97.39535869999999
                     },
                     "southwest" : {
                        "lat" : 6.4626999,
                        "lng" : 68.1097
                     }
                  }
               },
               "place_id" : "ChIJkbeSa_BfYzARphNChaFPjNc",
               "types" : [ "country", "political" ]
            }
         ],
         "status" : "OK"
      }
   }
   else address = {"plus_code":{"compound_code":"English"}};
     address = JSON.stringify(address);
     address = JSON.parse(address);
     
res.header("Access-Control-Allow-Origin", "*");
    res.send(address);
    
});

app.listen(3000, () => console.log('listening on port 3000...'));