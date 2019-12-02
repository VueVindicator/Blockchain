const Blockchain = require('./blockchain');
const bitcoin = new Blockchain();
const previousBlockHash = 'KJJHNKDHKHKJKJDKJNJND' ;
const currentBlockData = [
{
	amount: 20,
	sender: 'ijosodjoidsjdojsodjs',
	recepient: 'isliduliu43iuh4iu'
},
{
	amount: 100,
	sender: 'dkjndkjdnkjnk2323',
	recepient: '32k3kjnkjnk2333'
},
{
	amount: 102,
	sender: '32jkn2333ojjj3op33',
	recepient: '3ji3oij3oij323jo32j'
}
]
const nonce = 100;

hashed = bitcoin.hashBlock(previousBlockHash, currentBlockData, 87811);

correctHash = bitcoin.proofOfWork(previousBlockHash, currentBlockData);

console.log(bitcoin);
