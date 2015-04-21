
    var websocket;

    function start () {


      refreshAnalgoscore(100);

      $('#HR').knob(
        {
          'width': '150',
          'height': '150',
          'min': 40,
          'max': 120,
          'inputColor':"#00A",
          'fgColor':"#00A",
          'bgColor': "#FFF"
        });

      $('#MAP').knob(
        {
          'width': '150',
          'height': '150',
          'min': 60,
          'max': 150,
          'inputColor':"#00A",
          'fgColor':"#00A",
          'bgColor': "#FFF"
        });

      $('#EvapSev').knob(
        {
          'width': '150',
          'height': '150',
          'fgColor':"#8AE",
          'min': 0,
          'max': 100
        });
      
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

    

  