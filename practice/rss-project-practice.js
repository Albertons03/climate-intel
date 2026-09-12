const rawTitles = [
  "  Solar power reaches new record  ",
  "Wind energy investment grows",
  "Solar power reaches new record",
  "  Carbon prices fall ",
  "Wind energy investment grows  ",
];

const seenStr = new Set();
const uniqueTitles = [];

const pureTitles = rawTitles.map(str => str.trim());

console.log(pureTitles);



for(const title of pureTitles){

if( seenStr.has(title)){
    continue;
}
  seenStr.add(title);
  uniqueTitles.push(title);
}

console.log(uniqueTitles);



