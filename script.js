const btnChuyendoi = document.querySelector('.btnChuyendoi');
const input = document.querySelector('input');

const handleConvertToPrefix = () => {
    let stack = [];
    let output="";
    const value = input.value;
    const ArrayString = Array.from(value)
    if(ArrayString[0]===')'){
        alert('sai biểu thức')
        return
    }
    ArrayString.forEach(token => {
        debugger
        if (token !== "*" && token !== "/" && token !== "%" && token !== "+" && token !== "-" && token !=="(") {
            output += token
        } else {
             if(stack.length===0){
                stack.push(token)
             }
             else{
                if(compare(token) > compare(stack[stack.length-1])){
                    stack.push(token)
                }else{
                    if(token !== ')' && token !== '('){
                        output+=stack.reverse().join("")
                        stack=[];
                        stack.push(token)
                        
                    }
                    else{

                        for(let i= stack.length-1;i>=0;i--){
                            if(stack[i]!=="("){
                                output+=stack[i]
                                stack.pop()
                            }else{
                                stack.pop();
                                break;
                            }
                        }
                    }
                }
             }

        }
    });
    output+=stack.reverse().join("")
    console.log(output);

}
const compare = (text) => {
    if (text == "*" || text == "/" || text == "%")
        return 2;
    if (text == "+" || text == "-")
        return 1;
    return 0;
}





// if (token !== ")") {
//     const lastDigit = stack[stack.length - 1]
//     if (compare(lastDigit) > compare(token)) {
//         output += lastDigit
//         stack.splice(-1, 1);
//         stack.push(token)
//     } else {
//         stack.push(token)
//     }
// } else {
//     for(let i= stack.length-1; i>=0 ;i--){
//         if(stack[i]==="+" || stack[i]==="-" || stack[i]==="*" || stack[i]==="/" || stack[i]==="%"){
//             output+=stack[i]
//             const newStack= stack.filter(s=>s!==stack[i])
//             stack= [...newStack];
//         }else if(stack[i]=== '('){
//             stack.splice(-1, 1);
//             return
//         }
//     }
// }