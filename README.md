# test-tweetnacl-js-mobile
Testing repo for some benchmarks on mobile

This app is for understanding the performance of tweetnacl-js on mobile devices versus SJCL on mobile devices, which we find too slow.

# Latest perf measurements:

<pre>
app.test()
boxing nacl mock status: 104.980ms index.js:69
opening nacl mock status: 49.317ms index.js:79
boxing nacl long string: 32.746ms index.js:69
opening nacl long string: 35.431ms index.js:79
encrypt sjcl mock status: 227.081ms index.js:217
decrypt sjcl mock status: 153.534ms index.js:227
encrypt sjcl long string: 667.481ms index.js:217
decrypt sjcl long string: 703.278ms index.js:227
generating a MB of data... one sec. index.js:99
nacl MB: 104.065ms index.js:106
nacl decrypt MB: 73.456ms index.js:117
generating a MB of data... one sec. index.js:121
creating a string... one sec. index.js:124
sjcl MB: 8996.948ms index.js:132
sjcl MB decrypt: 8895.965ms 
</pre>
