import fs from 'fs';

const data = [
    {
        name: "aa",
        age: 18
    },
    {
        name: 'bb',
        age: 19
    }

]

fs.appendFile('test.txt', JSON.stringify(data), (err)=>{
    if(err) {
        console.log('write file failed');
    }
})
