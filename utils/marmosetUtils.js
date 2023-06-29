class VerifiCode {

    constructor(){
        console.log("Verification class has been created.");
        this.codearray = [];
    }

    create = ({wallet})=>{
        var newcode = {
            code:Math.random().toString(36).substring(2, 6).toUpperCase(),
            expires:Date.now()+1000*10,
            wallet:wallet
        };
        this.codearray.push(newcode);
        return newcode;
    }
    verify = (code)=>{
        // 0: invalid code
        // 1: time expired
        // 2: everything is ok
       var isOne = this.codearray.find((arr)=> arr.code === code);
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
    
}
exports.VerifiCode = new VerifiCode();