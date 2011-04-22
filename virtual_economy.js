(function(window,undefined){
  window.Player = function(starting_market_index,starting_credits,economy){
    var self = {},
        fuel_capacity = 200;
    var get_market = function(index){
      return economy.get_market(index);
    };
    self.market = get_market(starting_market_index);
    self.credits = starting_credits;
    self.fuel = fuel_capacity;
    self.goods = {
        'red':0,
        'green':0,
        'blue':0
      };
    self.travel_to = function(index){
      var m = get_market(index),
          dist = get_distance(self.market,m);
      if(dist > self.fuel) return;
      self.fuel = Math.floor((self.fuel - dist) * 10) / 10;
      self.market = m;
    };
    self.purchase = function(type){
      var market = self.market,
          price = market.goods[type];
      if(self.credits >= price){
        self.credits -= price;
        self.goods[type]++;
      };
    };
    self.sell = function(type){
      var market = self.market,
          price = market.goods[type];
      if(self.goods[type] > 0){
        self.credits += price;
        self.goods[type]--;
      };
    };
    self.refuel = function(){
      var market = self.market,
          price = market.fuel_price;
      if(self.credits >= price && self.fuel + 10 <= fuel_capacity){
        self.credits -= price;
        self.fuel += 10;
      };
    };
    return self;
  };
  window.Economy = function(market_size){
    var self = {},
        width = market_size,
        height = market_size;
    self.get_market = function(index){
      var market = new Market(index,width,height),
          index = market.index,
          neighbors = [],
          dist,
          m;
      for(var i = 0; i < market_size; i++){
        if(i === index) continue;
        m = new Market(i,width,height);
        dist = Math.floor(get_distance(market,m) * 10) / 10;
        if(dist < 20){
          neighbors[neighbors.length] = {'index':m.index,'name':m.name,'distance':dist};
        };
      };
      market.neighbors = neighbors;
      return market;
    };
    return self;
  };
  var Market = function(seed,max_x,max_y){
    var self = {},
        random = new CustomRandom(seed);
    self.index = seed;
    self.name = new NameMaker(seed).get_name();
    self.x = random.next() * max_x;
    self.y = random.next() * max_y;
    self.fuel_price = Math.floor(random.next() * 20 + 7);
    self.goods = {
        'red':Math.floor(random.next() * 60 + 10),
        'green':Math.floor(random.next() * 60 + 10),
        'blue':Math.floor(random.next() * 60 + 10)
      };
    return self;
  };
  var CustomRandom = function(seed){
    var self = {},
        random = new Alea(seed);
    self.next = function(){
      return random();
    };
    return self;
  };
  var NameMaker = function(seed){
    var self = {},
        random = new CustomRandom(seed);
    self.get_name = function(){
      var syllable_count = Math.floor(random.next() * 3) + 2,
          name = generate_name(syllable_count);
      while(!is_sensible_name(name)){
        name = generate_name(syllable_count);
      };
      name = name.split("");
      name[0] = name[0].toUpperCase();
      return name.join("");
    };
    var generate_name = function(syllables){
      var name = [];
      for(var i = 0; i < syllables; i++){
        name[name.length] = digraphs[Math.floor(random.next() * digraphs.length)];
      };
      name[name.length] = random.next() > 0.5 ? digraphs[Math.floor(random.next() * digraphs.length)] : trigraphs[Math.floor(random.next() * trigraphs.length)];
      return name.join("");
    };
    var is_sensible_name = function(name){
      return name.match(/.*[aeiou]{3}.*/i) === null;
    };
    var digraphs = [
         "a", "ac", "ad", "ar", "as", "at", "ax", "ba", "bi", "bo", "ce", "ci",
        "co", "de", "di", "e", "ed", "en", "es", "ex", "fa", "fo", "ga", "ge",
        "gi", "gu", "ha", "he", "in", "is", "it", "ju", "ka", "ky", "la", "le",
        "le", "lo", "mi", "mo", "na", "ne", "ne", "ni", "no", "o", "ob", "oi",
        "ol", "on", "or", "or", "os", "ou", "pe", "pi", "po", "qt", "re", "ro",
        "sa", "se", "so", "ta", "te", "ti", "to", "tu", "ud", "um", "un", "us",
        "ut", "va", "ve", "ve", "za", "zi"
      ];
    var trigraphs = [
        "cla", "clu", "cra", "cre", "dre", "dro", "pha", "phi", "pho", "sha",
        "she", "sta", "stu", "tha", "the", "thi", "thy", "tri"
      ];
    return self;
  };
  var get_distance = function(m0,m1){
    return Math.sqrt(Math.pow(m1.x - m0.x,2) + Math.pow(m1.y - m0.y,2));
  };
})(window);
