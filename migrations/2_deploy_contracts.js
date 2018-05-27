// deploy contracts, you want to migrate here

var mgt =  artifacts.require("./MiggersToken.sol");

module.exports = function(deployer) {
	deployer.deploy(mgt)
	.then(() => console.log(mgt.address))
};
