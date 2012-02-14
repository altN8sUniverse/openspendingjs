OpenSpending = "OpenSpending" in window ? OpenSpending : {};

(function ($) {

OpenSpending.TreeMap = function (elem) {
  var self = this

  this.$e = $(elem)

  this.init = function () {
  }

  this.setDataFromAggregator = function (dataset, dimension, data) {
    console.log(data);
    this.data = {children: _.map(data.children, function(item) {
      var entry = {
        children: [],
        id: item.id,
        name: item.label || item.name,
        data: {
            value: item.amount,
            $area: Math.floor(item.amount / 10000),
            title: item.label || item.name,
            show_title: true,
            link: 'http://openspending.org/' + dataset + '/' + dimension + '/' + item.name,
            $color: item.color || '#333333'
          }
        };
      return entry;
    })};
    console.log(this.data);
  }

  this.draw = function () {
    var self = this;
    self.tm = new $jit.TM.Squarified({
        injectInto: self.$e[0],
        levelsToShow: 1,
        titleHeight: 0,
        animate: true,

        offset: 2,
        Label: {
          type: 'HTML',
          size: 12,
          family: 'Tahoma, Verdana, Arial',
          color: '#DDE7F0'
          },
        Node: {
          color: '#243448',
          CanvasStyles: {
            shadowBlur: 0,
            shadowColor: '#000'
          }
        },
        Events: {
          enable: true,
          onClick: function(node) {
            if(node) {
                document.location.href = node.data.link;
            }
          },
          onRightClick: function() {
            self.tm.out();
          },
          onMouseEnter: function(node, eventInfo) {
            if(node) {
              node.setCanvasStyle('shadowBlur', 8);
              node.orig_color = node.getData('color');
              node.setData('color', '#A3B3C7');
              self.tm.fx.plotNode(node, self.tm.canvas);
              // tm.labels.plotLabel(tm.canvas, node);
            }
          },
          onMouseLeave: function(node) {
            if(node) {
              node.removeData('color');
              node.removeCanvasStyle('shadowBlur');
              node.setData('color', node.orig_color);
              self.tm.plot();
            }
          }
        },
        duration: 1000,
        Tips: {
          enable: true,
          type: 'Native',
          offsetX: 20,
          offsetY: 20,
          onShow: function(tip, node, isLeaf, domElement) {
            var html = '<div class="tip-title">' + node.name +
                ': ' + OpenSpending.Utils.formatAmount(node.data.value) +
                '</div><div class="tip-text">';
            var data = node.data;
            tip.innerHTML = html; 
          }  
        },
        //Implement this method for retrieving a requested  
        //subtree that has as root a node with id = nodeId,  
        //and level as depth. This method could also make a server-side  
        //call for the requested subtree. When completed, the onComplete   
        //callback method should be called.  
        request: function(nodeId, level, onComplete){  
          // var tree = eval('(' + json + ')');
          var tree = json;  
          var subtree = $jit.json.getSubtree(tree, nodeId);  
          $jit.json.prune(subtree, 1);  
          onComplete.onComplete(nodeId, subtree);  
        },
        //Add the name of the node in the corresponding label
        //This method is called once, on label creation and only for DOM labels.
        onCreateLabel: function(domElement, node){
            //console.log(node);
            if (node.data.show_title) {
                domElement.innerHTML = "<div class='desc'><h2>" + OpenSpending.Utils.formatAmount(node.data.value) + "</h2>" + node.name + "</div>";
            } else {
                domElement.innerHTML = "&nbsp;";
            }
        }
    });
    self.tm.loadJSON(this.data);
    self.tm.refresh();
  }

  this.init()
  return this
}

})(jQuery)

