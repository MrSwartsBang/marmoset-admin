class VerifiCode {

    constructor(){
        console.log("Verification class has been created.");
        this.codearray = [];
    }

    create = ({wallet})=>{

        var isWallet = this.codearray.find(arr=>arr.wallet===wallet);
        var code = Math.random().toString(36).substring(2, 6).toUpperCase();
        var expires = Date.now()+1000*60*15;
        if(isWallet)
        {   
            isWallet.code = code;
            isWallet.expires = expires;
            console.log(this.codearray);
            return isWallet;
        }
        else{
            var newcode = {code,expires,wallet};
            this.codearray.push(newcode);
        }
        console.log(this.codearray);
        return newcode;
    }
    verify = (code)=>{
        // 0: invalid code
        // 1: time expired
        // 2: everything is ok
        console.log(code);
       var isOne = this.codearray.find((arr)=> arr.code === code);
       console.log(isOne);
       if(isOne){
            if(isOne.expires > Date.now())
            {
                this.codearray = this.codearray.filter(item => item.code !== isOne.code);
                console.log(this.codearray);
                return isOne.wallet;
            }
            else {
                this.codearray = this.codearray.filter(item => item.code !== isOne.code);
                return 1;
            }
        }
       else return 0;
    }

    update = (code)=>{
    }
    
}
exports.VerifiCode = new VerifiCode();