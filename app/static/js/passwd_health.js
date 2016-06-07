//判断输入密码的类型    
function CharMode(iN){    
    if (iN>=48 && iN <=57) //数字    
        return 1;    
    if (iN>=65 && iN <=90) //大写    
        return 2;    
    if (iN>=97 && iN <=122) //小写    
        return 4;    
    else    
        return 8;     
}  
//bitTotal函数    
//计算密码模式    
function bitTotal(num){    
    modes=0;    
    for (i=0;i<4;i++){    
        if (num & 1) modes++;    
        num>>>=1;    
    }  
    return modes;    
}  
//返回强度级别    
function checkStrong(sPW){    
    if (sPW.length<6)    
        return 0; //密码太短，不检测级别  
    Modes=0;    
    for (i=0;i<sPW.length;i++){    
        //密码模式    
        Modes|=CharMode(sPW.charCodeAt(i));    
    }  
    return bitTotal(Modes);    
}

// main
function passwd_health(passwd) {
	S_level=checkStrong(passwd);
	return S_level;
}