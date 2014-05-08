//Color Conversion functions
function RGBtoHSB(r,g,b,valueToReturn){
	r/=255, g/=255, b/=255;
	var max=Math.max(r,g,b), min=Math.min(r,g,b);
	var h,s,v=max;
	var d=max-min;
	s= max == 0 ? 0 : d / max;
	if(max==min){
		h=0;
	}else{
		switch(max){
			case r: h = (g - b) / d + (g < b ? 6 : 0); break;
			case g: h = (b - r) / d + 2; break;
			case b: h = (r - g) / d + 4; break;
		}
		h/=6;
	}
	if(valueToReturn=="hue"){
		return h*360;
	}else if(valueToReturn=="saturation"){
		return s*100;
	}else if(valueToReturn=="brightness" || valueToReturn=="value"){
		return b*100;
	}
}
function HSBtoRGB(h,s,v,valueToReturn){
	var r,g,b;
	h/=60;
	s/=100;
	v/=100;
	var i= Math.floor(h);
	var f=h-i;
	var p=v*(1-s);
	var q=v*(1-s*f);
	var t=v*(1-s*(1-f));
	switch(i%6){
		case 0:r=v, g=t, b=p; break;
		case 1:r=q, g=v, b=p; break;
		case 2:r=p, g=v, b=t; break;
		case 3:r=p, g=q, b=v; break;
		case 4:r=t, g=p, b=v; break;
		case 5:r=v, g=p, b=q; break;
	}
	if(valueToReturn=="red"){
		return r*255;
	}else if(valueToReturn=="green"){
		return g*255;
	}else if(valueToReturn=="blue"){
		return b*255;
	}
}
var hue=360;
var saturation=100;
var brightness=0;
function updateHSBRGB(){
	hueInput.value=hue.toFixed(0);
	saturationInput.value=saturation.toFixed(0);
	brightnessInput.value=brightness.toFixed(0);
	redInput.value=HSBtoRGB(hue,saturation,brightness,"red").toFixed(0);
	greenInput.value=HSBtoRGB(hue,saturation,brightness,"green").toFixed(0);
	blueInput.value=HSBtoRGB(hue,saturation,brightness,"blue").toFixed(0);
	color.style.backgroundColor="rgb("+redInput.value+","+greenInput.value+","+blueInput.value+")";
}
//Saturation/Brightness picker
	var SatBriPosX,SatBriPosY;
	function SatBriSectionMove(e){
		//possibly one or two pixels off
		SatBriPosX=e.pageX-SatBriSection.offsetLeft-SatBriSection.parentNode.offsetLeft;
		SatBriPosY=e.pageY-SatBriSection.offsetTop-SatBriSection.parentNode.offsetTop;
		if(SatBriPosX>=1 && SatBriPosX<=255 && SatBriPosY>=1 && SatBriPosY<=255){
			selectedColor.style.right=(255-SatBriPosX)+10+"px";
			selectedColor.style.bottom=(255-SatBriPosY)-5+"px";
			saturation=((SatBriPosX)/255)*100;
			brightness=((255-SatBriPosY)/255)*100;
			updateHSBRGB();
		}else{
			SatBriSection.onmousemove=null;
		}
	}
	SatBriSection.onmousedown=function(e){
		SatBriSectionMove(e);
		SatBriSection.onmousemove=function(e){
			SatBriSectionMove(e);
		}
		SatBriSection.onmouseup=function(){
			SatBriSection.onmousemove=null;
		}
	}
//Hue picker
	var HuePosX, HuePosY
	function HueBarMove(e){
		HuePosY=e.pageY-hueSection.offsetTop-10;
		HuePosX=e.pageX-hueSection.offsetLeft-23;
		if(HuePosX>=1 && HuePosX<=20 && HuePosY){
			for(var i=0;i<document.getElementsByClassName("arrow").length;i++){
				document.getElementsByClassName("arrow")[i].style.bottom=(255-HuePosY-3)+"px";
			}
			hue=(HuePosY/256)*360;
			SatBri.style.backgroundColor="hsl("+hue+",100%,50%)"
			updateHSBRGB();
		}
	}
	hueSection.onmousedown=function(e){
		HueBarMove(e);
		hueSection.onmousemove=function(e){
			HueBarMove(e);
		}
		hueSection.onmouseup=function(){
			hueSection.onmousemove=null;
		}
	}
//Input Color Picker
	var last;
	for(var i=0;i<document.getElementsByClassName("HSB").length;i++){
		document.getElementsByClassName("HSB")[i].onkeydown=function(){
			last=this.value;
		}
		document.getElementsByClassName("HSB")[i].oninput=function(){
			if(hueInput.value.length>=0 && hueInput.value!=NaN){
				hue=hueInput.value;
				hue=parseInt(hue);
				SatBri.style.backgroundColor="hsl("+hue+",100%,50%)"
			}
			if(saturationInput.value.length>=0 && saturationInput.value!=NaN){
				saturation=saturationInput.value;
				saturation=parseInt(saturation);
				SatbriPosX=(saturation/100)*255
			}
			if(brightnessInput.value.length>=0 && brightnessInput.value!=NaN){
				brightness=brightnessInput.value;
				brightness=parseInt(brightness);
			}
			if(hueInput.value.length>0 && brightnessInput.value.length>0 && saturationInput.value.length>0){
				HuePosY=(hue/360)*256;
				for(var i=0;i<document.getElementsByClassName("arrow").length;i++){
					document.getElementsByClassName("arrow")[i].style.bottom=(255-HuePosY-3)+"px";
				}
				SatBriPosX=(saturation/100)*255;
				SatBriPosY=255-((brightness/100)*255);
				selectedColor.style.right=(255-SatBriPosX)+10+"px";
				selectedColor.style.bottom=(255-SatBriPosY)-5+"px";
				updateHSBRGB();
				this.onblur=function(){
					 if((this.id=="hueInput" && parseInt(this.value)>360) || ((this.id=="saturationInput" || this.id=="brightnessInput") && parseInt(this.value)>100)){
					 	this.value=last;
					 	document.getElementsByClassName("HSB")[i].oninput.call();
					 }
				}
			}else{
				this.onblur=function(){
					console.log(parseInt(this.value)>360)
					if(this.value.length<1){
						this.value=last;
					}
				}
			}
		}
	}
	for(var i=0;i<document.getElementsByClassName("RGB").length;i++){
		document.getElementsByClassName("RGB")[i].onkeydown=function(){
			last=this.value;
		}
		document.getElementsByClassName("RGB")[i].oninput=function(){
			if(redInput.value.length>0 && greenInput.value.length>0 && blueInput.value.length>0){
				hue=RGBtoHSB(redInput.value,greenInput.value,blueInput.value,"hue");
				saturation=RGBtoHSB(redInput.value,greenInput.value,blueInput.value,"saturation");
				brightness=RGBtoHSB(redInput.value,greenInput.value,blueInput.value,"brightness");
				HuePosY=(hue/360)*256;
				for(var i=0;i<document.getElementsByClassName("arrow").length;i++){
					document.getElementsByClassName("arrow")[i].style.bottom=(255-HuePosY-3)+"px";
				}
				SatBriPosX=(saturation/100)*255;
				SatBriPosY=255-((brightness/100)*255);
				this.onblur=function(){
					 if(this.value>255){
					 	this.value=last;
					 	document.getElementsByClassName("HSB")[i].oninput.call();
					 }
				}
				selectedColor.style.right=(255-SatBriPosX)+10+"px";
				selectedColor.style.bottom=(255-SatBriPosY)-5+"px";
				hueInput.value=hue.toFixed(0);
				saturationInput.value=saturation.toFixed(0);
				brightnessInput.value=brightness.toFixed(0);
				color.style.backgroundColor="rgb("+redInput.value+","+greenInput.value+","+blueInput.value+")";
			}else{
				this.onblur=function(){
					if(this.value.length<1 || parseInt(this.value)<256){
						this.value=last;
					}
				}
			}
		}
	}