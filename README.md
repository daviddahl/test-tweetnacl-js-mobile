# test-tweetnacl-js-mobile
Testing repo for some benchmarks on mobile

This app is for understanding the performance of tweetnacl-js on mobile devices versus SJCL on mobile devices, which we find too slow.

# Latest perf measurements:

<pre>
app.test()

boxing nacl mock status: 194.885ms index.js:69

opening nacl mock status: 69.336ms index.js:79

boxing nacl long string: 71.289ms index.js:69

opening nacl long string: 61.462ms index.js:79

encrypt sjcl mock status: 232.177ms index.js:217

decrypt sjcl mock status: 209.991ms index.js:227

encrypt sjcl long string: 737.519ms index.js:217

decrypt sjcl long string: 772.003ms index.js:227

generating a MB of data... one sec. index.js:99

nacl MB: 70.923ms index.js:106

nacl decrypt MB: 70.679ms index.js:117

generating a MB of data... one sec. index.js:121

creating a string... one sec. index.js:124

sjcl MB: 9200.989ms index.js:132

sjcl MB decrypt: 9295.288ms 
</pre>
