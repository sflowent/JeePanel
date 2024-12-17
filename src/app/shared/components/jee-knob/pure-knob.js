/*
 * pure-knob
 *
 * Canvas-based JavaScript UI element implementing touch,
 * keyboard, mouse and scroll wheel support.
 *
 * Copyright 2018 - 2021 Andre Plötze
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    /* AMD. Register as an anonymous module. */
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    /*
     * Node.
     *
     * Does not work with strict CommonJS, but
     * only CommonJS-like environments that support
     * module.exports, like Node.
     */
    module.exports = factory();
  } else {
    /* Browser globals (root is window). */
    root.pureknob = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  function PureKnob() {
    /*
     * Creates a knob element.
     */
    this.createKnob = function (width, height) {
      const heightString = height.toString();
      const widthString = width.toString();
      const smaller = width < height ? width : height;
      const canvas = document.createElement('canvas');
      const div = document.createElement('div');

      div.style.display = 'inline-block';
      div.style.height = heightString + 'px';
      div.style.position = 'relative';
      div.style.textAlign = 'center';
      div.style.width = widthString + 'px';
      div.appendChild(canvas);

      /*
       * The knob object.
       */
      const knob = {
        _canvas: canvas,
        _div: div,
        _height: height,
        _listeners: [],
        _mousebutton: false,
        _previousVal: 0,
        _timeout: null,
        _timeoutDoubleTap: null,
        _touchCount: 0,
        _width: width,

        /*
         * Notify listeners about value changes.
         */
        _notifyUpdate: function () {
          const properties = this._properties;
          const value = properties.val;
          const listeners = this._listeners;
          const numListeners = listeners.length;

          /*
           * Call all listeners.
           */
          for (let i = 0; i < numListeners; i++) {
            const listener = listeners[i];

            /*
             * Call listener, if it exists.
             */
            if (listener !== null) {
              listener(this, value);
            }
          }
        },

        /*
         * Properties of this knob.
         */
        _properties: {
          angleEnd: 2.0 * Math.PI,
          angleOffset: -0.5 * Math.PI,
          angleStart: 0,
          colorBG: '#181818',
          colorFG: '#ff8800',
          colorLabel: '#ffffff',
          fnStringToValue: function (string) {
            return parseInt(string);
          },
          fnValueToString: function (value) {
            return value.toString();
          },
          label: null,
          needle: false,
          readonly: false,
          textScale: 1.0,
          trackWidth: 0.4,
          valMin: 0,
          valMax: 100,
          val: 0,
          unitValue: '',
        },

        /*
         * Abort value change, restoring the previous value.
         */
        abort: function () {
          const previousValue = this._previousVal;
          const properties = this._properties;
          properties.val = previousValue;
          this.redraw();
        },

        /*
         * Adds an event listener.
         */
        addListener: function (listener) {
          const listeners = this._listeners;
          listeners.push(listener);
        },

        /*
         * Commit value, indicating that it is no longer temporary.
         */
        commit: function () {
          const properties = this._properties;
          const value = properties.val;
          this._previousVal = value;
          this.redraw();
          this._notifyUpdate();
        },

        /*
         * Returns the value of a property of this knob.
         */
        getProperty: function (key) {
          const properties = this._properties;
          const value = properties[key];
          return value;
        },

        /*
         * Returns the current value of the knob.
         */
        getValue: function () {
          const properties = this._properties;
          const value = properties.val;
          return value;
        },

        /*
         * Return the DOM node representing this knob.
         */
        node: function () {
          const div = this._div;
          return div;
        },

        /*
         * Redraw the knob on the canvas.
         */
        redraw: function () {
          this.resize();
          const properties = this._properties;
          const needle = properties.needle;
          const angleStart = properties.angleStart;
          const angleOffset = properties.angleOffset;
          const angleEnd = properties.angleEnd;
          const actualStart = angleStart + angleOffset;
          const actualEnd = angleEnd + angleOffset;
          const label = properties.label;
          const value = properties.val;
          const valueToString = properties.fnValueToString;
          const valueStr = valueToString(value);
          const valMin = properties.valMin;
          const valMax = properties.valMax;
          const relValue = (value - valMin) / (valMax - valMin);
          const relAngle = relValue * (angleEnd - angleStart);
          const angleVal = actualStart + relAngle;
          const colorTrack = properties.colorBG;
          const colorFilling = properties.colorFG;
          const colorText = properties.colorText;
          const trackWidth = properties.trackWidth;
          const height = this._height;
          const width = this._width;
          const smaller = width < height ? width : height;
          const centerX = 0.5 * width;
          const centerY = 0.5 * height;
          const radius = 0.4 * smaller;
          const lineWidth = Math.round(trackWidth * radius);
          const canvas = this._canvas;
          const ctx = canvas.getContext('2d');

          if (!properties.fontSizeAuto && properties.fontSize > 0) {
            fontSizeString = properties.fontSize.toString();
          }

          /*
           * Clear the canvas.
           */
          ctx.clearRect(0, 0, width, height);

          /*
           * Draw the track.
           */
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius, actualStart, actualEnd);
          ctx.lineCap = 'round';
          ctx.lineWidth = lineWidth;
          ctx.strokeStyle = colorTrack;
          ctx.stroke();

          /*
           * Draw the filling.
           */
          ctx.beginPath();

          /*
           * Check if we're in needle mode.
           */
          if (needle) {
            ctx.arc(centerX, centerY, radius, angleVal - 0.1, angleVal + 0.1);
          } else {
            ctx.arc(centerX, centerY, radius, actualStart, angleVal);
          }

          ctx.lineCap = 'round';
          ctx.lineWidth = lineWidth;
          ctx.strokeStyle = colorFilling;
          ctx.stroke();

          /*
           * Draw cursor
           */
          ctx.beginPath();
          ctx.strokeStyle = 'red';
          ctx.arc(centerX, centerY, radius, angleVal, angleVal);
          ctx.stroke();

          ctx.beginPath();

          ctx.strokeStyle = 'white';
          ctx.lineWidth = lineWidth - 5;
          ctx.arc(centerX, centerY, radius, angleVal, angleVal);
          ctx.stroke();

          /*
           * Draw the value and label.
           */
          ctx.beginPath();

          ctx.fillStyle = colorText;

          // value fontsize
          const maxWidthText = radius * 1;
          const maxHeightText = radius * 0.5;
          const valueFontSize = calculateFontSize(valueStr, maxWidthText, maxHeightText, ctx);

          // Draw unit
          let unitOffset = 0;
          if (properties.unitValue) {
            const valueTextMetrics = ctx.measureText(valueStr);

            const unitFontSize = valueFontSize * 0.4;
            ctx.font = `${unitFontSize}px sans-serif`;
            ctx.textAlign = 'left';
            ctx.textBaseline = 'bottom';

            const unitMetrics = ctx.measureText(properties.unitValue);
            unitOffset = unitMetrics.width;

            ctx.fillText(properties.unitValue, centerX + valueTextMetrics.width / 2, centerY);
          }

          // Draw the Value
          ctx.font = valueFontSize + 'px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(valueStr, centerX, centerY);

          // Draw the label
          if (label !== null) {
            let labelFontSize = calculateFontSize(label, maxWidthText, maxHeightText, ctx);
            labelFontSize = Math.min(labelFontSize, valueFontSize * 0.28);

            ctx.font = labelFontSize + 'px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            const subLabelYOffset = -labelFontSize * 3.5;
            ctx.fillText(label, centerX, centerY + subLabelYOffset);
          }
        },

        /*
         * This is called as the canvas or the surrounding DIV is resized.
         */
        resize: function () {
          const canvas = this._canvas;
          const ctx = canvas.getContext('2d');
          const scale = window.devicePixelRatio;
          canvas.style.height = this._height + 'px';
          canvas.style.width = this._width + 'px';
          canvas.height = Math.floor(this._height * scale);
          canvas.width = Math.floor(this._width * scale);
          ctx.scale(scale, scale);
        },

        /*
         * Sets the value of a property of this knob.
         */
        setProperty: function (key, value) {
          this._properties[key] = value;
          this.redraw();
        },

        /*
         * Sets the value of this knob.
         */
        setValue: function (value) {
          this.setValueFloating(value);
          this.commit();
        },

        /*
         * Sets floating (temporary) value of this knob.
         */
        setValueFloating: function (value) {
          const properties = this._properties;
          const valMin = properties.valMin;
          const valMax = properties.valMax;

          /*
           * Clamp the actual value into the [valMin; valMax] range.
           */
          if (value < valMin) {
            value = valMin;
          } else if (value > valMax) {
            value = valMax;
          }

          value = Math.round(value);
          this.setProperty('val', value);
        }
      };

      const calculateFontSize = function (text, maxWidth, maxHeight, ctx) {
        let fontSize = maxHeight; // Commence avec la hauteur maximale
        ctx.font = `${fontSize}px sans-serif`;
        let metrics = ctx.measureText(text);

        // Réduire la taille de la police jusqu'à ce que le texte tienne dans les dimensions spécifiées
        while ((metrics.width > maxWidth || fontSize > maxHeight) && fontSize > 0) {
          fontSize--;
          ctx.font = `${fontSize}px sans-serif`;
          metrics = ctx.measureText(text);
        }

        return fontSize;
      };

      /*
       * Convert mouse event to value.
       */
      const mouseEventToValue = function (e, properties) {
        const canvas = e.target;
        const width = canvas.scrollWidth;
        const height = canvas.scrollHeight;
        const centerX = 0.5 * width;
        const centerY = 0.5 * height;
        const x = e.offsetX;
        const y = e.offsetY;
        const relX = x - centerX;
        const relY = y - centerY;
        const angleStart = properties.angleStart;
        const angleEnd = properties.angleEnd;
        const angleDiff = angleEnd - angleStart;
        let angle = Math.atan2(relX, -relY) - angleStart;
        const twoPi = 2.0 * Math.PI;

        /*
         * Make negative angles positive.
         */
        if (angle < 0) {
          if (angleDiff >= twoPi) {
            angle += twoPi;
          } else {
            angle = 0;
          }
        }

        const valMin = properties.valMin;
        const valMax = properties.valMax;
        let value = (angle / angleDiff) * (valMax - valMin) + valMin;

        /*
         * Clamp values into valid interval.
         */
        if (value < valMin) {
          value = valMin;
        } else if (value > valMax) {
          value = valMax;
        }

        return value;
      };

      /*
       * Convert touch event to value.
       */
      const touchEventToValue = function (e, properties) {
        const canvas = e.target;
        const rect = canvas.getBoundingClientRect();
        const offsetX = rect.left;
        const offsetY = rect.top;
        const width = canvas.scrollWidth;
        const height = canvas.scrollHeight;
        const centerX = 0.5 * width;
        const centerY = 0.5 * height;
        const touches = e.targetTouches;
        let touch = null;

        /*
         * If there are touches, extract the first one.
         */
        if (touches.length > 0) {
          touch = touches.item(0);
        }

        let x = 0.0;
        let y = 0.0;

        /*
         * If a touch was extracted, calculate coordinates relative to
         * the element position.
         */
        if (touch !== null) {
          const touchX = touch.clientX;
          x = touchX - offsetX;
          const touchY = touch.clientY;
          y = touchY - offsetY;
        }

        const relX = x - centerX;
        const relY = y - centerY;
        const angleStart = properties.angleStart;
        const angleEnd = properties.angleEnd;
        const angleDiff = angleEnd - angleStart;
        const twoPi = 2.0 * Math.PI;
        let angle = Math.atan2(relX, -relY) - angleStart;

        /*
         * Make negative angles positive.
         */
        if (angle < 0) {
          if (angleDiff >= twoPi) {
            angle += twoPi;
          } else {
            angle = 0;
          }
        }

        const valMin = properties.valMin;
        const valMax = properties.valMax;
        let value = (angle / angleDiff) * (valMax - valMin) + valMin;

        /*
         * Clamp values into valid interval.
         */
        if (value < valMin) {
          value = valMin;
        } else if (value > valMax) {
          value = valMax;
        }

        return value;
      };

      /*
       * This is called when the mouse button is depressed.
       */
      const mouseDownListener = function (e) {
        const btn = e.buttons;

        /*
         * It is a left-click.
         */
        if (btn === 1) {
          const properties = knob._properties;
          const readonly = properties.readonly;

          /*
           * If knob is not read-only, process mouse event.
           */
          if (!readonly) {
            e.preventDefault();
            const val = mouseEventToValue(e, properties);
            knob.setValueFloating(val);
          }

          knob._mousebutton = true;
        }
      };

      /*
       * This is called when the mouse cursor is moved.
       */
      const mouseMoveListener = function (e) {
        const btn = knob._mousebutton;

        /*
         * Only process event, if mouse button is depressed.
         */
        if (btn) {
          const properties = knob._properties;
          const readonly = properties.readonly;

          /*
           * If knob is not read-only, process mouse event.
           */
          if (!readonly) {
            e.preventDefault();
            const val = mouseEventToValue(e, properties);
            knob.setValueFloating(val);
          }
        }
      };

      /*
       * This is called when the mouse button is released.
       */
      const mouseUpListener = function (e) {
        const btn = knob._mousebutton;

        /*
         * Only process event, if mouse button was depressed.
         */
        if (btn) {
          const properties = knob._properties;
          const readonly = properties.readonly;

          /*
           * If knob is not read only, process mouse event.
           */
          if (!readonly) {
            e.preventDefault();
            const val = mouseEventToValue(e, properties);
            knob.setValue(val);
          }
        }

        knob._mousebutton = false;
      };

      /*
       * This is called when the drag action is canceled.
       */
      const mouseCancelListener = function (e) {
        const btn = knob._mousebutton;

        /*
         * Abort action if mouse button was depressed.
         */
        if (btn) {
          knob.abort();
          knob._mousebutton = false;
        }
      };

      /*
       * This is called when a user touches the element.
       */
      const touchStartListener = function (e) {
        const properties = knob._properties;
        const readonly = properties.readonly;
      };

      /*
       * This is called when a user moves a finger on the element.
       */
      var touchMoveListener = function (e) {
        const btn = knob._mousebutton;

        /*
         * Only process event, if mouse button is depressed.
         */
        if (btn) {
          const properties = knob._properties;
          const readonly = properties.readonly;

          /*
           * If knob is not read-only, process touch event.
           */
          if (!readonly) {
            const touches = e.targetTouches;
            const numTouches = touches.length;
            const singleTouch = numTouches === 1;

            /*
             * Only process single touches, not multi-touch
             * gestures.
             */
            if (singleTouch) {
              e.preventDefault();
              const val = touchEventToValue(e, properties);
              knob.setValueFloating(val);
            }
          }
        }
      };

      /*
       * This is called when a user lifts a finger off the element.
       */
      const touchEndListener = function (e) {
        const btn = knob._mousebutton;

        /*
         * Only process event, if mouse button was depressed.
         */
        if (btn) {
          const properties = knob._properties;
          const readonly = properties.readonly;

          /*
           * If knob is not read only, process touch event.
           */
          if (!readonly) {
            const touches = e.targetTouches;
            const numTouches = touches.length;
            const noMoreTouches = numTouches === 0;

            /*
             * Only commit value after the last finger has
             * been lifted off.
             */
            if (noMoreTouches) {
              e.preventDefault();
              knob._mousebutton = false;
              knob.commit();
            }
          }
        }

        knob._mousebutton = false;
      };

      /*
       * This is called when the size of the canvas changes.
       */
      const resizeListener = function (e) {
        knob.redraw();
      };

      /*
       * This is called when the mouse wheel is moved.
       */
      const scrollListener = function (e) {
        const readonly = knob.getProperty('readonly');

        /*
         * If knob is not read only, process mouse wheel event.
         */
        if (!readonly) {
          e.preventDefault();
          const delta = e.deltaY;
          const direction = delta > 0 ? 1 : delta < 0 ? -1 : 0;
          let val = knob.getValue();
          val += direction;
          knob.setValueFloating(val);

          /*
           * Perform delayed commit.
           */
          const commit = function () {
            knob.commit();
          };

          let timeout = knob._timeout;
          window.clearTimeout(timeout);
          timeout = window.setTimeout(commit, 250);
          knob._timeout = timeout;
        }
      };

      /*
       * Listen for device pixel ratio changes.
       */
      const updatePixelRatio = function () {
        const pixelRatio = window.devicePixelRatio;
        knob.redraw();
        const pixelRatioString = pixelRatio.toString();
        const matcher = '(resolution:' + pixelRatioString + 'dppx)';

        const params = {
          once: true,
        };

        window.matchMedia(matcher).addEventListener('change', updatePixelRatio, params);
      };

      canvas.addEventListener('mousedown', mouseDownListener);
      canvas.addEventListener('mouseleave', mouseCancelListener);
      canvas.addEventListener('mousemove', mouseMoveListener);
      canvas.addEventListener('mouseup', mouseUpListener);
      canvas.addEventListener('resize', resizeListener);
      canvas.addEventListener('touchstart', touchStartListener);
      canvas.addEventListener('touchmove', touchMoveListener);
      canvas.addEventListener('touchend', touchEndListener);
      canvas.addEventListener('wheel', scrollListener);
      updatePixelRatio();
      return knob;
    };
  }

  return new PureKnob();
});
