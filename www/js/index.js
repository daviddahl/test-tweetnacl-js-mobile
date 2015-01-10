var app = {
  // Application Constructor
  initialize: function() {
    this.bindEvents();
  },
  // Bind Event Listeners
  //
  // Bind any events that are required on startup. Common events are:
  // 'load', 'deviceready', 'offline', and 'online'.
  bindEvents: function() {
    document.addEventListener('deviceready', this.onDeviceReady, false);
  },
  // deviceready Event Handler
  //
  // The scope of 'this' is the event. In order to call the 'receivedEvent'
  // function, we must explicitly call 'app.receivedEvent(...);'
  onDeviceReady: function() {
    app.receivedEvent('deviceready');
    alert('Open the console to begin testing with \'app.test()\', view results');
  },
  // Update DOM on a Received Event
  receivedEvent: function(id) {
    var parentElement = document.getElementById(id);
    var listeningElement = parentElement.querySelector('.listening');
    var receivedElement = parentElement.querySelector('.received');

    listeningElement.setAttribute('style', 'display:none;');
    receivedElement.setAttribute('style', 'display:block;');

    console.log('Received Event: ' + id);
  },

  testContainers: {
    mockStatus: JSON.stringify({status: 'this is a status update, i want to talk about the weather',
                 updated: Date.now(),
                 location: '87, -43'}),
    longString: 'Eric Arthur Blair (George Orwell) was born in 1903 in India, where his father worked for the Civil Service. The family moved to England in 1907 and in 1917 Orwell entered Eton, where he contributed regularly to the various college magazines. He left in 1921 and joined the Indian Imperial Police in Burma the following year, in which he served until 1928.\n\nHis first published article appeared in Le Monde in October 1928, while Orwell was living in Paris, and he returned to England in 1929 to take up work as a private tutor and later as a scoolteacher (1932). Down and Out in Paris and London was published in 1933. Due to his poor health, Orwell gave up teaching, and worked as a part-time assistant in a Hampstead bookshop, and later was able to earn his living reviewing novels for the New English Weekly, a post he kept until 1940.\n\nAt the end of 1936 Orwell went to Spainto fight for the Republicans and was wounded. During the Second World War he was a member of the Home Guard and worked for the BBC Eastern Service from 1940 to 1943. As literary editor of Tribune he contributed a regular page of political and literary commentary. From 1945 Orwell was the Observer’s war correspondent and later became a regular contributor to the Manchester Evening News.\n\nOrwell suffered from tuberculosis, and was in and out of hospital from 1947 until his death in 1950. He was forty-six.\n\nHis publications include The Road to Wigan Pier, Coming Up for Air, Keep the Aspidistra Flying and Homage to Catalonia. Orwell’s name became widely known with the publication of Animal Farm and Nineteen Eighty-Four, both of which have sold more that two million copies. All Orwell’s works have been published in Penguin.'
  },

  generateAMegabyte: function () {
    var mb = new Uint8Array(1024000);
    var segment = 64000;
    var offset = 0;
    for (var i = 0; i < 16; i++) {
      var sixtyFourK = new Uint8Array(64000);
      window.crypto.getRandomValues(sixtyFourK);
      mb.set(sixtyFourK, offset);
      offset = offset + segment;
    }
    return mb;
  },

  test100EncryptDecryptOps: function testContainerStatus(str, testName) {
    var encrypted = [];
    console.time('boxing ' + testName);

    for (var i = 0; i < 100; i++) {
      var key = nacl.randomBytes(32);
      var nonce = nacl.randomBytes(24);
      try {
        var box = app.secretBox(str, nonce, key);
        encrypted.push(box);
      } catch (ex) {
        console.error(ex);
        continue;
      }
    }

    console.timeEnd('boxing ' + testName);

    var decrypted = [];

    console.time('opening ' + testName);

    for (i = 0; i < encrypted.length; i++) {
      decrypted.push(app.secretOpen(encrypted[i]));
    }

    console.timeEnd('opening ' + testName);

    return {
      encrypted: encrypted,
      decrypted: decrypted
    };

  },

  test: function test() {
    app.test100EncryptDecryptOps(app.testContainers.mockStatus, 'nacl mock status');
    app.test100EncryptDecryptOps(app.testContainers.longString, 'nacl long string');
    app.sjclTest(app.testContainers.mockStatus, 'sjcl mock status');
    app.sjclTest(app.testContainers.longString, 'sjcl long string');

    app.testMB();
    app.testMBsjcl();
  },

  testMB: function () {
    console.warn('generating a MB of data... one sec.');
    var mb = app.generateAMegabyte();
    var key = nacl.randomBytes(32);
    var nonce = nacl.randomBytes(24);

    console.time('nacl MB');
    var secret = nacl.secretbox(mb, nonce, key);
    console.timeEnd('nacl MB');

    var result =  {
      secret: secret,
      nonce: nonce,
      key: key
    };

    // decrypt:
    console.time('nacl decrypt MB');
    var decrypted = nacl.secretbox.open(result.secret, nonce, key);
    console.timeEnd('nacl decrypt MB');
  },

  testMBsjcl: function () {
    console.warn('generating a MB of data... one sec.');
    var mb = app.generateAMegabyte();

    console.warn('creating a string... one sec.');
    // create a string... sigh.
    var str = '';
    for (var i = 0; i < mb.length; i++) {
      str += mb[i];
    }
    console.time('sjcl MB');
    var result = app.sjclEncrypt(str);
    console.timeEnd('sjcl MB');

    // decrypt
    console.time('sjcl MB decrypt');
    app.sjclDecrypt(result.key, result.ciphertext);
    console.timeEnd('sjcl MB decrypt')
  },

  encode: function encode(str) {
    return new TextEncoder('utf-8').encode(str);
  },

  decode: function encode(arr) {
    return new TextDecoder('utf-8').decode(arr);
  },

  string2CharCode: function string2CharCode(str) {
    var arr = new Uint8Array(str.length);

    for (var i = 0; i < str.length; i++) {
      arr[i] = str.charCodeAt(i);
    }
    return arr;
  },

  charCode2Str: function charCode2Str(arr) {
    var plaintxt = [];
    for (var i = 0; i < arr.length; i++) {
      plaintxt.push(String.fromCharCode(arr[i]));
    }
    return plaintxt.join('');

  },

  secretBox: function secretBox(str, nonce, key) {
    // this function creates the nonce and returns it as part of the operation
    var plaintxtArr = app.string2CharCode(str);
    // var plaintxtArr = app.encode(str);
    var secret = nacl.secretbox(plaintxtArr, nonce, key);

    return {
      secret: secret,
      nonce: nonce,
      key: key
    };
  },

  secretOpen: function secretOpen(box) {
    // nacl.secretbox.open(box, nonce, key)
    var plaintxtArr = nacl.secretbox.open(box.secret, box.nonce, box.key);
    var txt = app.charCode2Str(plaintxtArr);
    // var txt = app.decode(plaintxtArr);
    return txt;
  },

  sjclCipherOptions: {
    mode: 'gcm'
  },

  sjclEncrypt: function sjclEncrypt (str) {

    var key =  sjcl.random.randomWords(8); // 8 'words' = 32 bytes
    var ciphertext = sjcl.encrypt(key, str, app.sjclCipherOptions);

    return {
      key: key,
      ciphertext: ciphertext
    };

  },

  sjclDecrypt: function sjclDecrypt (key, ciphertext) {
    var message = sjcl.decrypt(key,
                               ciphertext,
                               app.sjclCipherOptions);
    return message;
  },

  sjclTest: function sjclTest(str, testName) {
    var encrypted = [];
    console.time('encrypt ' + testName);

    for (var i = 0; i < 100; i++) {
      encrypted.push(app.sjclEncrypt(str));
    }
    console.timeEnd('encrypt ' + testName);

    var decrypted = [];
    console.time('decrypt ' + testName);

    for (var i = 0; i < encrypted.length; i++) {
      var d = app.sjclDecrypt(encrypted[i].key,
                              encrypted[i].ciphertext);
      decrypted.push(d);
    }
    console.timeEnd('decrypt ' + testName);

    return {
      encrypted: encrypted,
      decrypted: decrypted
    };
  }
};

app.initialize();
