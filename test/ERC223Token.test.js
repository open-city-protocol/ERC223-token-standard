const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const chaiBigNumber = require('chai-bignumber');
const Web3 = require('web3');

const ERC223TokenMock = artifacts.require('ERC223TokenMock');
const ContractReceiverMock = artifacts.require('ContractReceiverMock');

chai.use(chaiAsPromised);
chai.use(chaiBigNumber(Web3.utils.BigNumber));
chai.should();

contract.only('OCPToken', (accounts) => {
  const creator = accounts[1];
  const tokenHolder = accounts[2];

  beforeEach(async () => {
    const web3 = new Web3(ERC223TokenMock.web3.currentProvider);
    this.token = await ERC223TokenMock.new({ from: creator });

    // todo: upgrade test when passes with truffle
    // Truffle doesn't support this contract - multiple functions with same name
    // https://github.com/trufflesuite/truffle/issues/569
    this.tokenWeb3 = new web3.eth.Contract(ERC223TokenMock.abi, this.token.address);
  });

  describe('transfer', () => {
    const transferAmount = Web3.utils.toHex(Math.ceil(Math.random() * 1000));
    const data = Web3.utils.toHex(Math.ceil(Math.random() * 1000));

    describe('account', () => {
      it('correctly transfers', async () => {
        await this.tokenWeb3.methods.transfer(tokenHolder, transferAmount).send({ from: creator });
        (await this.token.balanceOf(tokenHolder)).should.be.bignumber.equal(transferAmount);
      });
    });

    describe('OCPTokenReceiver', () => {
      beforeEach(async () => {
        this.receiver = await ContractReceiverMock.new({ from: creator });
      });

      it('correctly transfers with address and value', async () => {
        await this.tokenWeb3.methods.transfer(
          this.receiver.address,
          transferAmount,
        ).send({ from: creator, gas: 0xfffff });

        (await this.token.balanceOf(this.receiver.address))
          .should.be.bignumber.equal(transferAmount);

        (await this.receiver.from()).should.equal(creator);
        (await this.receiver.value()).should.be.bignumber.equal(transferAmount);
      });

      it('correctly transfers with address, value, and data', async () => {
        await this.tokenWeb3.methods.transfer(
          this.receiver.address,
          transferAmount,
          data,
        ).send({ from: creator, gas: 0xfffff });

        (await this.token.balanceOf(this.receiver.address))
          .should.be.bignumber.equal(transferAmount);

        (await this.receiver.from()).should.equal(creator);
        (await this.receiver.value()).should.be.bignumber.equal(transferAmount);
        (await this.receiver.data()).should.be.bignumber.equal(data);
      });

      it('correctly transfers with address, value, data, and tokenFallback', async () => {
        const fallback = 'tokenFallback(address,uint256,bytes)';
        await this.tokenWeb3.methods.transfer(
          this.receiver.address,
          transferAmount,
          data,
          fallback,
        ).send({ from: creator, gas: 0xfffff });

        (await this.token.balanceOf(this.receiver.address))
          .should.be.bignumber.equal(transferAmount);

        (await this.receiver.from()).should.equal(creator);
        (await this.receiver.value()).should.be.bignumber.equal(transferAmount);
        (await this.receiver.data()).should.be.bignumber.equal(data);
        (await this.receiver.fallback()).should.equal(fallback);
      });

      it('correctly transfers with address, value, data, and customTokenFallback', async () => {
        const fallback = 'customTokenFallback(address,uint256,bytes)';
        await this.tokenWeb3.methods.transfer(
          this.receiver.address,
          transferAmount,
          data,
          fallback,
        ).send({ from: creator, gas: 0xfffff });

        (await this.token.balanceOf(this.receiver.address))
          .should.be.bignumber.equal(transferAmount);

        (await this.receiver.from()).should.equal(creator);
        (await this.receiver.value()).should.be.bignumber.equal(transferAmount);
        (await this.receiver.data()).should.be.bignumber.equal(data);
        (await this.receiver.fallback()).should.equal(fallback);
      });
    });
  });
});
