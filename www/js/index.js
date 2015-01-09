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

  testContainerStatus: function testContainerStatus() {
    var encrypted = [];
    console.time('boxing status');

    for (var i = 0; i < 100; i++) {
      var key = nacl.randomBytes(32);
      var nonce = nacl.randomBytes(24);
      try {
        var box = app.secretBox(app.testContainers.mockStatus, nonce, key);
      } catch (ex) {
        console.error(ex);
        continue;
      }
      encrypted.push(box);
    }

    console.timeEnd('boxing status');

    var decrypted = [];

    console.time('opening status');

    for (i = 0; i < encrypted.length; i++) {
      decrypted.push(app.secretOpen(encrypted[i]));
    }

    console.timeEnd('opening status');

    return {
      encrypted: encrypted,
      decrypted: decrypted
    };

  },

  test: function test() {
    app.testContainerStatus();
    app.testLongString();
  },

  testLongString: function testLongString() {
    var encrypted = [];
    console.time('boxing status');

    for (var i = 0; i < 100; i++) {
      var key = nacl.randomBytes(32);
      var nonce = nacl.randomBytes(24);
      try {
        var box = app.secretBox(app.testContainers.longString, nonce, key);
      } catch (ex) {
        console.error(ex);
        continue;
      }
      encrypted.push(box);
    }

    console.timeEnd('boxing status');

    var decrypted = [];

    console.time('opening status');

    for (i = 0; i < encrypted.length; i++) {
      decrypted.push(app.secretOpen(encrypted[i]));
    }

    console.timeEnd('opening status');

    return {
      encrypted: encrypted,
      decrypted: decrypted
    };
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
    return txt;
  }

};

app.initialize();
