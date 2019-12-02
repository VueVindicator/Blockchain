function Blockchain(){
	this.chain = [];
	this.pendingTransactions = [];
}

Blockchain.prototype.createNewBlock = function(nonce, hash, previousBlockHash){
	const newBlock = {
		index: this.chain.length + 1,
		time: Date.now(),
		transactions: this.pendingTransactions,
		nonce: nonce,
		hash: hash,
		previousBlockHash: previousBlockHash
	};
	this.pendingTransactions = [];
	this.chain.push(newBlock);

	return newBlock;
}

Blockchain.prototype.getLastBlock = function(){
	return this.chain[this.chain.length - 1];
}

Blockchain.prototype.createNewTransaction = function(amount, sender, recepient){
	const newTransaction = {
		amount: this.amount,
		sender: this.sender,
		recepient: this.recepient
	};

	this.pendingTransactions.push(newTransaction);
	
	return this.getLastBlock()['index'] + 1;
}

module.exports = Blockchain;