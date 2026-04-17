const baseWords = [
  "amber","apple","arch","arrow","artist","ash","atlas","autumn","bamboo","bay",
  "beacon","bear","berry","birch","bird","blaze","bloom","blue","boat","boulder",
  "breeze","brook","brush","butter","cabin","cactus","candle","canyon","cardinal","castle",
  "cedar","cherry","chime","circle","clay","cloud","coast","cobalt","comet","coral",
  "cotton","cove","crane","crystal","daisy","dawn","delta","desert","diamond","dove",
  "dream","drift","dune","eagle","earth","echo","elm","ember","emerald","falcon",
  "feather","fern","field","finch","fire","flame","flora","flower","fog","forest",
  "fox","frost","garden","glade","glass","glow","gold","grain","granite","grass",
  "grove","harbor","harmony","hawk","hazel","hill","hollow","horizon","ice","iris",
  "island","jade","jasmine","jet","juniper","lake","lantern","lark","laurel","leaf",
  "lemon","light","lilac","lily","linen","lotus","marble","maple","meadow","mercury",
  "mist","monarch","moon","morning","moss","mountain","nectar","night","nova","oak",
  "oasis","ocean","olive","onyx","opal","orchid","owl","pearl","pebble","pine",
  "plum","pond","prairie","quartz","raven","reef","ridge","river","robin","rose",
  "ruby","sable","saffron","sage","sand","scarlet","sea","shadow","shore","silver",
  "sky","snow","solstice","spark","spring","spruce","star","stone","storm","stream",
  "summer","sun","sunrise","sunset","swift","temple","thistle","thunder","tide","timber",
  "topaz","trail","tree","tulip","valley","velvet","violet","water","wave","willow",
  "wind","winter","wood","wren","zephyr","acorn","almond","antler","apricot","aurora",
  "badger","basil","beetle","blossom","branch","brass","brooklet","caper","caramel","cinder",
  "cliff","clover","copper","current","cypress","daffodil","elmwood","fable","fawn","fig",
  "firefly","fjord","flint","gale","garnet","ginger","glacier","heather","heron","honey",
  "hyacinth","indigo","ivory","kestrel","lagoon","lavender","lunar","mango","misty","mulberry",
  "narwhal","nectarine","north","olivewood","pastel","petal","phoenix","poppy","rain","raspberry",
  "sapphire","seaglass","sepia","sprout","starlight","tangerine","terra","whisper","wild","yarrow"
];

const words = [];

for (let i = 0; i < baseWords.length; i += 1) {
  words.push(baseWords[i]);
}

for (let i = 1; i <= 6; i += 1) {
  for (let j = 0; j < baseWords.length; j += 1) {
    words.push(`${baseWords[j]}${i}`);
  }
}

export default words;