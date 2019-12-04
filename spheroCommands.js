import sphero from './sphero.js/devices/sphero';
import core from './sphero.js/devices/core';
import Packet from './sphero.js/packet';
const packet = new Packet();

const device = {
  seq: 0,
  command: function(vDevice, cmdName, data, callback) {
    const seq = this.seq++;
    console.log('Seq', seq);
    const opts = {
      sop2: this.sop2Bitfield,
      did: vDevice,
      cid: cmdName,
      seq: seq,
      data: data,
      emitPacketErrors: this.emitPacketErrors,
    };

    var cmdPacket = packet.create(opts);
    return cmdPacket;
  },
};
sphero(device);
core(device);

export function roll(...args) {
  return device.roll(...args);
}
