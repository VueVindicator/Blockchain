var express = require('express');
var app = express();
const bodyParser = require('body-parser');
const blockchain = require('./blockchain');
const uuid = require('uuid/v1');

const port = process.argv[2];
const rp = require('request-promise');

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

//register a node and broadcast that in the network
app.post('/register-and-broadcast-node', function(req, res){
	const newNodeUrl = req.body.newNodeUrl;
	if (bitcoin.networkNodes.indexOf(newNodeUrl) == -1) bitcoin.networkNodes.push(newNodeUrl);
	const registerNodesPromises = [];
	bitcoin.networkNodes.forEach(networkNodeUrl => {
		const requestOptions = {
			uri: networkNodeUrl + '/register-node',
			method: "POST",
			body: { newNodeUrl : newNodeUrl },
			json: true 
		};

		registerNodesPromises.push(rp(requestOptions));
	});

	Promise.all(registerNodesPromises)
	.then(data => {
		const bulkRegisterOptions = {
			uri: newNodeUrl+ '/register-nodes-bulk',
			method: 'POST',
			body: { allNetworkNodes : [ ...bitcoin.networkNodes, bitcoin.currentNodeUrl ]},
			json: true
		};

		return rp(bulkRegisterOptions);
	});
	.then(data => {
		res.json({ note: 'New Node Registered with Network Successfully' });
	});
});

app.post('/register-node', function(req, res){
	
});

app.post('/register-nodes-bulk', function(req, res){
	//
});

app.listen(port, function(){
	console.log(`Listening on port ${port}...`);
});