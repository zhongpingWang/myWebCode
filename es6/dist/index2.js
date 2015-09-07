'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

define(function (require, exports, module) {

     // var alt=require("/es6/alt/dist/alt.js");

     var Alt = require('/es6/alt/dist/alt.js');
     var alt = new Alt();

     var HelloWordAction = (function () {
          function HelloWordAction() {
               _classCallCheck(this, HelloWordAction);
          }

          _createClass(HelloWordAction, [{
               key: 'show',
               value: function show(type) {
                    this.actions.updateShow(type);
               }
          }, {
               key: 'updateShow',
               value: function updateShow(type) {
                    this.dispatch(type);
               }
          }]);

          return HelloWordAction;
     })();

     var ActionHelloWord = alt.createActions(HelloWordAction);

     var HelloWordStore = (function () {
          function HelloWordStore() {
               _classCallCheck(this, HelloWordStore);

               var listeners = {
                    handleUpdate: ActionHelloWord.UPDATE_SHOW

               };
               this.bindListeners(listeners);
          }

          _createClass(HelloWordStore, [{
               key: 'handleUpdate',
               value: function handleUpdate(type) {
                    this.name = type * 9;
               }
          }]);

          return HelloWordStore;
     })();

     var StoreHelloWord = alt.createStore(HelloWordStore, "HelloWordStore");

     var HelloWord = React.createClass({
          displayName: 'HelloWord',

          componentDidMount: function componentDidMount() {
               StoreHelloWord.listen(this.handleSessionChange);
               SessionActions.fetch();
          },

          componentWillUnmount: function componentWillUnmount() {
               StoreHelloWord.unlisten(this.handleSessionChange);
          },

          handleSessionChange: function handleSessionChange() {

               console.log(this.state);
          },

          getInitialState: function getInitialState() {
               return {
                    data: [1, 2, 3, 4]
               };
          },

          handleRemove: function handleRemove(i, event) {

               ActionHelloWord.show(i);

               var newItems = this.state.data;
               newItems.splice(i, 1);
               this.setState({ data: newItems });
          },

          handleAdd: function handleAdd() {

               var newItems = this.state.data.concat([prompt('Enter some text')]);
               this.setState({ data: newItems });
          },

          handleLast: function handleLast(i) {
               this.setState({ active: i });
          },

          render: function render() {

               var items = this.state.data.map((function (result, i) {

                    var left = i * 20;
                    if (this.state.active == i) {
                         left = i * 30;
                    };

                    var mLeft = {
                         marginLeft: left
                    };

                    return React.createElement(
                         'li',
                         { style: mLeft, onClick: this.handleRemove.bind(this, i) },
                         result
                    );
               }).bind(this));

               return React.createElement(
                    'div',
                    null,
                    React.createElement(
                         'button',
                         { onClick: this.handleAdd },
                         'Add Item'
                    ),
                    React.createElement(
                         'ul',
                         null,
                         items
                    )
               );
          }

     });

     var expors = {
          h: HelloWord,
          ah: ActionHelloWord,
          sh: StoreHelloWord
     };

     module.expors = expors;

     //React.render(<HelloWord/>,document.getElementById("example"));
});