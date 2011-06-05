/* areaOverload
 Copyright © 2011  Daniel S. Poulin

 This plugin is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 This plugin is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

(function( $ ) {
    var orig = {
            outerWidth: $.fn.outerWidth,
            outerHeight: $.fn.outerHeight,
            offset: $.fn.offset,
            position: $.fn.position
        }
        newelSelector = 'area';

    var methods = {
        areaDimensions: function(shape,coords) {
            //Make an object to store the dimensions
            var ret = {
                    height: 0,
                    width: 0
                },
                coordset = $.map(coords.split(','), function(el,i) {
                    return parseFloat(el);
                });

            //Based on the shape, determine the smallest box
            // that fits around it.
            switch(shape) {
                case 'rect':
                    ret.height = coordset[2] - coordset[0];
                    ret.width = coordset[3] - coordset[1];
                    break;
                case 'circle':
                    ret.height = 2*coordset[2];
                    ret.width = 2*coordset[2];
                    break;
                case 'poly':
                    var topmost = 100000000000,
                        bottommost = 0,
                        rightmost = 10000000000,
                        leftmost = 0;

                    //Find top, right, left and bottommost vertices
                    for (var i = 0; i < coordset.length(); i = i + 2) {
                        if (coordset[i] < leftmost) leftmost = coordset[i];
                        if (coordset[i+1] < topmost) topmost = coordset[i+1];
                        if (coordset[i] > rightmost) rightmost = coordset[i];
                        if (coordset[i+1] > bottommost) bottommost = coordset[i+1];
                    }

                    ret.height = bottommost - topmost;
                    ret.width = rightmost - leftmost;
                    break;
            }
            return ret;
        },
        areaPosition: function(shape,coords,refimg) {
            var ret = {
                    top: 0,
                    left: 0
                },
                coordset = $.map(coords.split(','), function(el,i) {
                    return parseFloat(el);
                });

            //Figure out the position of the parent.
            if (refimg) {
                $.extend(ret,orig.offset.apply(refimg));
            }

            //Based on the shape, determine the top left corner
            // of the smallest box that fits around it.
            switch(shape) {
                case 'rect':
                    ret.top += coordset[1];
                    ret.left += coordset[0];
                    break;
                case 'circle':
                    ret.top += (coordset[1] - (coordset[2]/2));
                    ret.left += (coordset[0] - (coordset[2]/2));
                    break;
                case 'poly':
                    var topmost = 100000000000,
                        leftmost = 0;

                    //Find top, right, left and bottommost vertices
                    for (var i = 0; i < coordset.length(); i = i + 2) {
                        if (coordset[i] < leftmost) leftmost = coordset[i];
                        if (coordset[i+1] < topmost) topmost = coordset[i+1];
                    }

                    ret.top += topmost;
                    ret.left += leftmost;
                    break;
            }
            return ret;
        }
    }

    $.fn.outerWidth = function(bool) {
        if ($(this).is(newelSelector)) {
            return methods.areaDimensions($(this).attr('shape'), $(this).attr('coords')).width;
        } else {
            return orig.outerWidth.apply(this, bool);
        }
    }

    $.fn.outerHeight = function(bool) {
        if ($(this).is(newelSelector)) {
            return methods.areaDimensions($(this).attr('shape'), $(this).attr('coords')).height;
        } else {
            return orig.outerHeight.apply(this, bool);
        }
    }

    $.fn.offset = function(coordsorcallback) {
        if ($(this).is(newelSelector)) {
            refimg = $(document).find('img[usemap="#' + $(this).parent().attr('id') + '"]');
            return methods.areaPosition($(this).attr('shape'), $(this).attr('coords'), refimg);
        } else {
            return orig.offset.apply(this, coordsorcallback);
        }
    }

    $.fn.position = function() {
        if ($(this).is(newelSelector)) {
            return methods.areaPosition($(this).attr('shape'), $(this).attr('coords'));
        } else {
            return orig.position.apply(this);
        }
    }

}) (jQuery);