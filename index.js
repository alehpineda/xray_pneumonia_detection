$(document).ready(function () {
  // Init
  $('.image-section').hide();
  $('.loader').hide();
  $('#result').hide();

  // Upload Preview
  function readURL(input) {
      if (input.files && input.files[0]) {
          var reader = new FileReader();
          reader.onload = function (e) {
              $('#imagePreview1').attr('src', e.target.result);
              $('#imagePreview').css('background-image', 'url(' + e.target.result + ')');
              $('#imagePreview').hide();
              $('#imagePreview').fadeIn(650);
          }
          reader.readAsDataURL(input.files[0]);
      }
  }
  $("#imageUpload").change(function () {
      $('.image-section').show();
      $('#btn-predict').show();
      $('#result').text('');
      $('#result').hide();
      readURL(this);
  });

    // Predict
    $('#btn-predict').click(function () {
      // Show loading animation
      $(this).hide();
      $('.loader').show();

      // Make prediction by calling app function
      app();
  });

});

let net;

async function loadModel() {
  // Load the model.
  $('#message').fadeIn(600);
  $('#message').text('Wait till the model loads');
  console.log('Loading InceptionV3...');
  $('#result').fadeIn(600);
  $('#result').text('Loading InceptionV3..');
  net = await tf.loadLayersModel('model/model.json');
  console.log('Sucessfully loaded model');
  $('#result').fadeIn(600);
  $('#result').text('Sucessfully loaded model');
  $('#message').hide();
}


async function app() {
  // Make a prediction through the model on our image.
  const imgEl = document.getElementById('imagePreview1');
  let tensor = preprocessImage(imgEl);  
  const results = await net.predict(tensor).data();
  //let prediction = await model.predict(tensor).data();
  //console.log(results[0].className);
  console.log('Prediction: ',results[0].className, '\n Probability: ',
    results[0].probability);
  // Get and display the result
  $('.loader').hide();
  $('#result').fadeIn(600);
  $('#result').text(' Result: ' + results[0].className + '\n Probability: ' + results[0].probability);
  console.log('Success!');
}

function preprocessImage(image) {
    let tensor=tf.browser.fromPixels(image)
    .resizeNearestNeighbor([150,150])
    .toFloat();

    let offset=tf.scalar(127.5);
    return tensor.sub(offset)
                .div(offset)
                .expandDims();
}

loadModel();