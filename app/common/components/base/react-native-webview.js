'use strict';

var React = require('react');
var  {
      AppRegistry,
      Component,
      StyleSheet,
      Text,
      View,
      WebView
} = require('react-native');
var DEFAULT_URL = 'http://www.lcode.org';

var ReactNativeWebview = React.createClass({
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
                background-color: "#f8f8f8";
              }
             div{
                width: 100%;
                height: auto;
                font-size: 1.2em;
                line-height: 1.6em;
                color: "#989898";
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
  handleNavigationStateChange:function(navState){
      console.log(navState);
  },
  render: function() {
    var HTML = this.genHtmlTpml(this.props.name);
    var {style,name,...props} = this.props;
    return (
        <WebView ref="webview" style={[styles.webview_style,style]} {...props} automaticallyAdjustContentInsets={false}
          source={{html:HTML}} 
          startInLoadingState={true} 
          onNavigationStateChange={this.handleNavigationStateChange}
          domStorageEnabled={true}
          javaScriptEnabled={true}
          >
        </WebView>
    )
  }
});

var styles = StyleSheet.create({
    webview_style:{  
       backgroundColor:"#f8f8f8"
    }
});


module.exports = ReactNativeWebview;