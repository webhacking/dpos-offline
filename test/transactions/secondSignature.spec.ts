import { expect } from 'chai';
import { LiskWallet } from '../../src/liskWallet';
import { ITransaction } from '../../src/trxTypes/BaseTx';
import { SendTx } from '../../src/trxTypes/Send';

// tslint:disable-next-line:no-var-requires
const txs = require(`${__dirname}/../data/secondSignatureTxs.json`);

describe('Transactions.send.secondSignature', () => {
  describe('txs', () => {
    txs.forEach((txData) => {
      const {secret, secondSecret, tx} = txData;
      const firstWallet = new LiskWallet(secret, 'L');
      const secondWallet = new LiskWallet(secondSecret, 'L');
      describe(`${tx.id}`, () => {
        let genTx: ITransaction<{}>;
        beforeEach(() => {
          genTx = new SendTx()
            .withFees(tx.fee)
            .withAmount(tx.amount)
            .withTimestamp(tx.timestamp)
            .withSenderPublicKey(tx.senderPublicKey)
            .withRecipientId(tx.recipientId)
            .sign(firstWallet, secondWallet.privKey);
        });
        it('should match signature', () => {
          expect(genTx.signature).to.be.deep.eq(tx.signature);
        });
        it('should match id', () => {
          expect(genTx.id).to.be.deep.eq(tx.id);
        });
        it('toString-Obj be eq to genTx', () => {
          // requesterPublicKey => null fails here
          const {requesterPublicKey} = genTx;
          delete genTx.requesterPublicKey;
          expect(genTx).to.be.deep.eq(tx);
          // tslint:disable-next-line no-unused-expression
          expect(requesterPublicKey).to.not.exist;
        });
      });

    });
  });

});
