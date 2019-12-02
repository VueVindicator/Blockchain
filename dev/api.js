var express = require('express');
var app = express();
const bodyParser = require('body-parser');
const blockchain = require('./blockchain');
const uuid = require('uuid/v1');

const nodeAddress = uuid().split('-').join('');

bitcoin = new blockchain();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/blockchain', function(req, res){
	res.send(bitcoin);
});

app.post('/transaction', function(req, res){
	const blockIndex = bitcoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recepient);
	res.json({ note: `Transaction will be added in block ${blockIndex}.`})
});

app.get('/mine', function(req, res){
	const lastBlock = bitcoin.getLastBlock();
	const prevBlockHash = lastBlock['hash'];
	const currentBlockData = {
		transactions: bitcoin.pendingTransactions,
		index: lastBlock['index'] + 1
	};
	const nonce = bitcoin.proofOfWork(prevBlockHash, currentBlockData);
	const blockHash = bitcoin.hashBlock(prevBlockHash, currentBlockData, nonce);
	
	bitcoin.createNewTransaction(12.5, "00", nodeAddress);
	
	const newBlock = bitcoin.createNewBlock(nonce, prevBlockHash, blockHash);
	res.json({
		note: "New Block mined successfully",
		block: newBlock
	});
});

app.listen(3000, function(){
	console.log('Listening on port 3000...');
});