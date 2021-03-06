(function() {
  var $,
    __hasProp = Object.prototype.hasOwnProperty;

  $ = OpenSpending.$;

  OpenSpending.Faceter = (function() {

    Faceter.prototype.options = {
      source: '/api/2/search',
      defaultParams: {}
    };

    function Faceter(element, dimensions, options) {
      var _this = this;
      this.dimensions = dimensions;
      this.options = $.extend(true, {}, this.options, options);
      this.element = $(element);
      this.element.html('');
      this.facetEls = {};
      this.filters = {};
      this.element.on('click', '.filter', function() {
        return _this.onFacetFilter.apply(_this, arguments);
      });
      this.element.on('click', '.unfilter', function() {
        return _this.onFacetUnfilter.apply(_this, arguments);
      });
      this.element.on('faceter:addFilter', function() {
        _this.addFilter.apply(_this, arguments);
        return _this.redraw();
      });
      this.element.on('faceter:removeFilter', function() {
        _this.removeFilter.apply(_this, arguments);
        return _this.redraw();
      });
    }

    Faceter.prototype.init = function() {
      return this.redraw();
    };

    Faceter.prototype.redraw = function() {
      var d, k, params, rq, v,
        _this = this;
      params = $.extend(true, {}, this.options.defaultParams, {
        pagesize: 0,
        facet_field: ((function() {
          var _i, _len, _ref, _results;
          _ref = this.dimensions;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            d = _ref[_i];
            _results.push(d.key);
          }
          return _results;
        }).call(this)).join('|'),
        filter: ((function() {
          var _ref, _results;
          _ref = this.filters;
          _results = [];
          for (k in _ref) {
            if (!__hasProp.call(_ref, k)) continue;
            v = _ref[k];
            _results.push("" + k + ":" + v);
          }
          return _results;
        }).call(this)).join("|")
      });
      rq = $.getJSON(this.options.source, params);
      rq.then(function(data) {
        var dim, _i, _len, _ref, _results;
        _this.facets = data.facets;
        _this.element.empty();
        _ref = _this.dimensions;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          dim = _ref[_i];
          _results.push(_this._drawDimension(dim));
        }
        return _results;
      });
      return rq.fail(OpenSpending.ajaxError("Source request failed. Params: " + (JSON.stringify(params))));
    };

    Faceter.prototype.addFilter = function(k, v) {
      return this.filters[k] = v;
    };

    Faceter.prototype.removeFilter = function(k) {
      if (k in this.filters) return delete this.filters[k];
    };

    Faceter.prototype.setDimensions = function(d) {
      return this.dimensions = d;
    };

    Faceter.prototype.onFacetFilter = function(e) {
      var k, v;
      k = $(e.target).attr('data-key');
      v = $(e.target).attr('data-value');
      this.element.trigger('faceter:addFilter', [k, v]);
      return false;
    };

    Faceter.prototype.onFacetUnfilter = function(e) {
      var k;
      k = $(e.target).attr('data-key');
      this.element.trigger('faceter:removeFilter', [k]);
      return false;
    };

    Faceter.prototype._drawDimension = function(dim) {
      var count, key, label, member, value, _i, _len, _ref, _ref2, _results;
      this.facetEls[dim.key] = $("<h4>" + (dim.label || dim.name) + "</h4>\n<table class=\"table table-condensed facets\"><tbody></tbody></table>").appendTo(this.element);
      _ref = this.facets[dim.key];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        _ref2 = _ref[_i], member = _ref2[0], count = _ref2[1];
        key = dim.key;
        value = member.name != null ? member.name : member;
        label = member.label != null ? member.label : member;
        if (!(key in this.filters) || this.filters[key] === value) {
          _results.push(this.facetEls[dim.key].find('tbody').append("<tr>\n  <td width=\"5%\" class=\"count num\">" + count + "</td>\n  <td>\n    <a class=\"" + (key in this.filters ? 'unfilter' : 'filter') + "\"\n       data-key=\"" + key + "\"\n       data-value=\"" + value + "\"\n       href=\"#\">\n      " + label + "\n    </a>\n  </td>\n</tr>"));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    return Faceter;

  })();

}).call(this);
