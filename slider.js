window.onload = function () {
    //��ȡԪ��
    function $(id) {
        return document.getElementById(id);
    }

    var js_slider = $('js-slider');

    var slider_main_block = $('slider_main_block');

    var imgs = slider_main_block.children;

    var slider_ctrl = $('slider_ctrl');

    //����Ԫ��
    for(var i=imgs.length; i>0; i--){
        var span = document.createElement('span');
        span.className = 'slider-ctrl-con';
        span.innerHTML = i;  //ʵ�ֵ������
        slider_ctrl.insertBefore(span,slider_ctrl.children[1]);
    }

    var spans = slider_ctrl.children;
    spans[1].setAttribute('class','slider-ctrl-con current');

    var scrollWidth = js_slider.clientWidth;  //�õ�����ӵĿ�� Ҳ���� ���涯���ߵľ���

    for (var i = 1; i<imgs.length; i++){
        imgs[i].style.left = scrollWidth + 'px';
    }

    var iNow = 0; //���� ���Ʋ�������
    for(var k in spans){
        spans[k].onclick = function(){
            //alert(this.innerHTML);
            if(this.className == 'slider-ctrl-prev')
            {
                animateJson(imgs[iNow],{left:scrollWidth});
                --iNow < 0 ? iNow = imgs.length - 1 : iNow;
                imgs[iNow].style.left = -scrollWidth + 'px';
                animateJson(imgs[iNow],{left:0});
                setSquare();
            }
            else if(this.className == 'slider-ctrl-next')
            {
                autoPlay();
            }
            else{

                var that = this.innerHTML - 1;
                if(that > iNow)
                {
                    animateJson(imgs[iNow],{left:-scrollWidth}); //��ǰ�������߳�ȥ
                    imgs[that].style.left = scrollWidth + 'px'; //����������ŵ� �����ߵ��Ҳ�
                }
                else if(that < iNow)
                {
                    animateJson(imgs[iNow],{left:scrollWidth});
                    imgs[that].style.left = -scrollWidth + 'px';
                }
                iNow = that; //����ǰ��������
                animateJson(imgs[iNow],{left:0});
                setSquare();
            }
        }
    }

    function setSquare(){ //����С���� ����span���ŵĺ���
        for(var i=1; i<spans.length-1; i++){
            //spans[i].style.backgroundPosition = '-24px -782px';
            spans[i].className = 'slider-ctrl-con';
        }
        spans[iNow+1].className = 'slider-ctrl-con current';
    }

    function autoPlay(){
        animateJson(imgs[iNow],{left:-scrollWidth});
        ++iNow > imgs.length - 1 ? iNow = 0 : iNow; //���Լ� ������
        imgs[iNow].style.left = scrollWidth + 'px';
        animateJson(imgs[iNow],{left:0});
        setSquare();
    }

    timer = setInterval(autoPlay,2000);

    js_slider.onmouseover = function(){
        clearInterval(timer);
    }

    js_slider.onmouseout = function(){
        clearInterval(timer);
        timer = setInterval(autoPlay,2000);
    }
}

var timer = null;
function animateJson(obj,json,fn){ //3
    clearInterval(obj.timer);
    obj.timer = setInterval(function(){
        //����json
        var flag = true; //�����ж��Ƿ�ֹͣ��ʱ��
        for(var attr in json){ // attr ����  json[attr] ����ֵ
            var current = 0;
            if(attr == 'opacity')
            {
                current = parseInt(getStyle(obj,attr)*100) || 0;
            }else
            {
                current = parseInt(getStyle(obj,attr));
            }
            var step = (json[attr] - current ) /10;
            step = step > 0 ? Math.ceil(step) : Math.floor(step);

            //�ж�͸����
            if(attr == 'opacity'){
                if('opacity' in obj.style){
                    obj.style.opacity = (current + step) /100;
                }else {
                    obj.style.filter = 'alpha(opacity = '+ (current + step) +')';
                }
            }else if(attr == 'zIndex'){
                obj.style.zIndex = json[attr];
            }
            else {
                obj.style[attr] = current + step + 'px';
            }
            if(current != json[attr]){
                flag = false;
            }
        }
        if(flag){
            clearInterval(obj.timer);
            if(fn){
                fn();
            }
        }
    })
}

function getStyle(obj,attr){
    if(obj.currentStyle){
        return obj.currentStyle[attr];
    }
    else {
        return window.getComputedStyle(obj,null)[attr];
    }
}
