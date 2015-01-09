# test-tweetnacl-js-mobile
Testing repo for some benchmarks on mobile

This app is for understanding the performance of tweetnacl-js on mobile devices versus SJCL on mobile devices, which we find too slow.

# Latest per measurements:

boxing nacl mock status: 14.191ms index.js:56

opening nacl mock status: 21.942ms index.js:66

boxing nacl long string: 31.860ms index.js:56

opening nacl long string: 53.681ms index.js:66

sjcl encrypt sjcl mock status: 106.110ms index.js:149

sjcl decrypt sjcl mock status: 149.842ms index.js:159

sjcl encrypt sjcl long string: 639.221ms index.js:149

sjcl decrypt sjcl long string: 746.979ms  
