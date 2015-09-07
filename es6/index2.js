 

 define(function (require, exports, module) {

   // var alt=require("/es6/alt/dist/alt.js");

    const Alt = require('/es6/alt/dist/alt.js');
    const alt = new Alt();

       class HelloWordAction{

          show(type){
               this.actions.updateShow(type);
          }  
          updateShow(type){
               this.dispatch(type);
          } 
     } 
     

     var ActionHelloWord=alt.createActions(HelloWordAction);



     class HelloWordStore{

          constructor() { 
             let listeners = {
                 handleUpdate: ActionHelloWord.UPDATE_SHOW
                 
             }
             this.bindListeners(listeners);
          }

          handleUpdate(type){
               this.name=type*9; 
          } 
     }

     var StoreHelloWord=alt.createStore(HelloWordStore,"HelloWordStore");


     var  HelloWord=React.createClass({

          componentDidMount() {
             StoreHelloWord.listen(this.handleSessionChange);
             SessionActions.fetch();
          },

          componentWillUnmount() {
             StoreHelloWord.unlisten(this.handleSessionChange);
          },


          handleSessionChange(){

               console.log(this.state);
          },

          getInitialState(){ 
               return {
                         data:[1,2,3,4],
                    }
          },

          handleRemove(i,event){

               ActionHelloWord.show(i);


                 var newItems = this.state.data;
                newItems.splice(i, 1);
                this.setState({data: newItems }); 
          },

          handleAdd(){

                var newItems =
                     this.state.data.concat([prompt('Enter some text')]);
                   this.setState({data: newItems });

          },


          handleLast(i){  
               this.setState({active:i}); 
          },
 
          render(){ 

               var items=this.state.data.map(function(result,i){

                    var left=i*20;
                    if (this.state.active==i) {
                         left=i*30;

                    }; 

                    var mLeft={
                         marginLeft:left
                    }

                    return <li style={mLeft}  onClick={this.handleRemove.bind(this,i)}>{result}</li>;
               }.bind(this)); 

               return (<div>
                     <button onClick={this.handleAdd}>Add Item</button>
                    <ul> 
                          
                              {items} 
                          
                    </ul></div>);
          }


     });


     var expors={
          h:HelloWord,
          ah:ActionHelloWord,
          sh:StoreHelloWord
     }

     module.expors=expors;

     //React.render(<HelloWord/>,document.getElementById("example"));

});
 

  