export default function getImageInfo(file,fn){
    return new Promise(function(resolve,reject){
        var reader = new FileReader();
        reader.onload = function(e){
            var image = new Image();
            image.onload = function (){
                let width = this.width;
                let height = this.height;
                let type = this.type
                let s = fn(Object.assign(file,{
                    width,height,type
                }));
                if(s){
                    resolve();
                }
            }
            image.src = e.target.result;
        }
        reader.readAsDataURL(file.raw);
    }).catch(() => {
        reject();
    })
}