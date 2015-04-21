
    var websocket;

    function start () {
      websocket = new WebSocket("ws://" + window.location.host + "/websocket");

      websocket.onmessage = function(event) { onMessage(event.data) };

      refreshAnalgoscore(100);

      $('#HR').knob(
        {
          'width': '150',
          'height': '150',
          'min': 40,
          'max': 120,
          'inputColor':"#00A",
          'fgColor':"#00A",
          'bgColor': "#FFF",
          'change' : function (v) { sendMessage("NormalHR|" + Math.round(v)) }
        });

      $('#MAP').knob(
        {
          'width': '150',
          'height': '150',
          'min': 60,
          'max': 150,
          'inputColor':"#00A",
          'fgColor':"#00A",
          'bgColor': "#FFF",
          'change' : function (v) { sendMessage("NormalMAP|" + Math.round(v)) }
        });

      $('#EvapSev').knob(
        {
          'width': '150',
          'height': '150',
          'fgColor':"#8AE",
          'min': 0,
          'max': 100,
          'change' : function (v) { sendMessage("EvapSev|" + Math.round(v)) }
        });
      
    }

    function onMessage (message) {
      var parts = message.split("|");
      var medicalId = parts[0];
      var medicalValue = parts[1];

      switch (medicalId) 
      {
        case "99":
          Analgoscore = parseInt(medicalValue);
          refreshAnalgoscore(Analgoscore);
          break;
        case "98":
          $("#HR").val(medicalValue).trigger('change');
          break;
        case "97":
          $("#MAP").val(medicalValue).trigger('change');
          break;
        case "anestesia":
        case "monitor":
          var arr = medicalValue.split(",");
          var days = arr[0];
          var hours = arr[1];
          var mins = arr[2];
          var secs = arr[3];
          $("#" + medicalId + "-value").text(days + " Д, " + hours + ":" + mins + ":" + secs);
          break;
        case "EvapSev":
          $("#EvapSev").val(medicalValue).trigger('change');
          break;
        case "ConsSev":
          RestCons = parseFloat($("#ConsSev").text());
          Cons = parseFloat(medicalValue);
          NewCons = Cons + RestCons;
          $("#ConsSev").text(NewCons.toString());
          break;
        case "357": $("#BIS_L").text(medicalValue); break;
        case "358": $("#BIS_R").text(medicalValue); break;
        case "359": $("#SQI_L").text(medicalValue); break;
        case "360": $("#SQI_R").text(medicalValue); break;
        case "361": $("#SR_L").text(medicalValue); break;
        case "362": $("#SR_R").text(medicalValue); break;
        case "363": $("#SEF_L").text(medicalValue); break;
        case "364": $("#SEF_R").text(medicalValue); break;
        case "365": $("#EMG_L").text(medicalValue); break;
        case "366": $("#EMG_R").text(medicalValue); break;
        case "367": $("#TP_L").text(medicalValue); break;
        case "368": $("#TP_R").text(medicalValue); break;
        case "369": $("#BC_L").text(medicalValue); break;
        case "370": $("#BC_R").text(medicalValue); break;
        case "371": $("#sBIS_L").text(medicalValue); break;
        case "372": $("#sBIS_R").text(medicalValue); break;
        case "373": $("#SEMG_L").text(medicalValue); break;
        case "374": $("#SEMG_R").text(medicalValue); break;
        case "375": $("#ASYM").text(medicalValue); break;
      
        default:;
      }
    }

    function sendMessage (message) {
      if (websocket.readyState == websocket.OPEN)
        websocket.send(message);
    }

    function refreshAnalgoscore (analgoscore) {
      var analgoscoreElem = $('#anValue');
      var analgoscoreBoardElem = $('#analgoscoreBoard');
      analgoscoreBoardElem.removeClass("black-alarm yellow-alarm green-alarm");
      var status;
      if (analgoscore == 100)
      {
        analgoscoreElem.text('-');
        status = "Hypotension";
      }
      else if (analgoscore == -100)
      {
        analgoscoreElem.text('-');
        status = "Vagal Reaction";
      }
      else
      {
        analgoscoreElem.text(analgoscore.toString());  
        if (analgoscore <= 3 && analgoscore >= -3)
          analgoscoreBoardElem.addClass("green-alarm");
        else if ((analgoscore < -3 && analgoscore >= -6) || (analgoscore <= 6 && analgoscore > 3))
          analgoscoreBoardElem.addClass("yellow-alarm");
        else 
          analgoscoreBoardElem.addClass("black-alarm");
      }

      drawScale(analgoscore);
    }

    function drawScale(value) {
      var canv = document.getElementById('analgoscore');
      var canvelem = $('#analgoscore');
      var verticalOffset = 30;
      var width = canvelem.width();
      var height = canvelem.height() - 2 * verticalOffset;
      var context = canv.getContext('2d');
      var colorArr = [ '#F00','#FF0','#0F0', '#0F0', '#FF0', '#F00'];

      // clear canvas
      context.clearRect(0, 0, width, canvelem.height());

      // draw color zones
      for (var i = 0; i < 6; i++)
      {
        context.fillStyle = colorArr[i];
        context.fillRect(50, verticalOffset + height/6*i, 50, height/6);
      }

      // draw black border lines between zones
      context.fillStyle = '#000';
      for (var i = 0; i < 5; i++)
      {
        context.fillRect(50, verticalOffset + height / 6 * (i + 1), 50, 1);
      }

      // draw numbers
      context.fillStyle = '#FFF';
      context.font = "bold 16px Arial";
      var textArr = ["9", "6", "3", "0", "-3", "-6", "-9"];
      for (var i = 0; i < 7; i++) 
      {
        context.fillText(textArr[i], (i > 3) ? 30 : 35, verticalOffset + 5 + height / 6 * i);
      }

      if (value != 100 && value != -100)
      {
        // draw arrow
        var arrowHeight = verticalOffset + height / 2 - value * height / 18;
        context.fillStyle = '#FFF';
        context.beginPath();
        context.moveTo(80, arrowHeight);
        context.lineTo(140, arrowHeight + 20);
        context.lineTo(140, arrowHeight - 20);
        context.closePath();
        context.fill();
        context.fillRect(50, arrowHeight - 5, 70, 10);
      }
      
    }

    

  