'use strict';

var React = require('react');
var  {
      StyleSheet,
      View,
      WebView
} = require('react-native');

var ReactNativeWebview = React.createClass({
  getInitialState:function(){
      return {
          name: this.props.name
      }
  },
  componentWillReceiveProps:function(nextProps){
      if(nextProps.name!=this.props.name){
          this.setState({
                name:false
          })
          setTimeout(this.updateStateFromProps,100);
      }
  },
  updateStateFromProps:function(){
      this.setState({
        name:this.props.name
      })
  },
  genHtmlTpml:function(name){
        const HTML = `
        <!DOCTYPE html>\n
        <html>
          <head>
            <title>HTML字符串</title>
            <meta http-equiv="content-type" content="text/html; charset=utf-8">
            <meta name="viewport" content="width=320, user-scalable=no">
            <style type="text/css">
              body {
                margin: 0;
                padding: 0;
              }
             div{
                width: 100%;
                height: auto;
                font-size: 1.2em;
                line-height: 1.6em;
                color: "#fff";
             }
            </style>
          </head>
          <body>
            <div>${name}</div>
            <script>
                // Inside of the webview
                top.postMessage(document.body.clientWidth, document.body.clientHeight);
            </script>
          </body>
        </html>
        `;
      return HTML;
  },
  render: function() {
    var HTML = this.genHtmlTpml(this.state.name);
    var {style,name,...props} = this.props;
    if(this.state.name){
        return (
            <WebView ref="webview" style={[styles.webview_style,style]} {...props} 
              automaticallyAdjustContentInsets={true}
              source={{html:HTML}} 
              startInLoadingState={true} 
              domStorageEnabled={true}
              javaScriptEnabled={true}
            >
            </WebView>
        )
    }else{
        return (<View/>)
    }
  }
});

var styles = StyleSheet.create({
    webview_style:{  
       backgroundColor:"#fff"
    }
});


module.exports = ReactNativeWebview;