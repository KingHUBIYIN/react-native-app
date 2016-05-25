module.exports = {
    cloneAttrs:function(source,attrs){
        var obj = {};
        if(!attrs) return obj;
        for(var i=0;i<attrs.length;i++){
            var attr = attrs[i];
            obj[attr] = source[attr];
        }
        return obj;
    }
}