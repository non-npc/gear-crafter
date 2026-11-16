'use strict';
window.GCData = (()=>{
 const rarities=[
 {name:'Common',color:'#cdd5df',weight:5000,icon:'⚪'},
 {name:'Uncommon',color:'#74ee91',weight:2500,icon:'🍀'},
 {name:'Magic',color:'#64d5ff',weight:1300,icon:'🔹'},
 {name:'Rare',color:'#5ca0ff',weight:700,icon:'💠'},
 {name:'Epic',color:'#db8bff',weight:300,icon:'🔮'},
 {name:'Legendary',color:'#ffcc57',weight:150,icon:'👑'},
 {name:'Mythic',color:'#ff77b5',weight:45,icon:'🌸'},
 {name:'Rainbow',color:'#ff8fcb',weight:5,icon:'🌈'}
 ];
 const categories={
 Weapons:[['⚔️','Sword'],['🗡️','Dagger'],['🪓','Battleaxe'],['🏹','Bow'],['🔱','Trident'],['🔨','Hammer'],['🪄','Wand'],['🛡️','Shield'],['🎯','Crossbow'],['🪃','Boomerang'],['🧹','Broomstick'],['🍴','Fork'],['🥄','Spoon'],['🔧','Wrench'],['🪚','Saw']],
 Armor:[['🪖','Helmet'],['🥾','Boots'],['🧤','Gloves'],['🧥','Coat'],['👑','Crown'],['🎩','Wizard Hat'],['🧣','Scarf'],['👗','Robe'],['🦺','Breastplate'],['👒','Sun Hat'],['👟','Sneakers']],
 Jewelry:[['💍','Ring'],['📿','Amulet'],['💎','Pendant'],['🪬','Talisman'],['⌚','Watch'],['👓','Spectacles'],['🧿','Charm'],['🪙','Medallion']],
 Potions:[['🧪','Elixir'],['🍾','Potion'],['🍼','Bottle'],['🫖','Teapot'],['🥤','Magic Juice'],['☕','Coffee Cup']],
 Artifacts:[['📖','Spellbook'],['📜','Scroll'],['🔮','Crystal Ball'],['🗝️','Key'],['🧭','Compass'],['🪞','Mirror'],['🕯️','Candle'],['🏺','Vase'],['⏳','Hourglass'],['🪗','Accordion']],
 Treasures:[['💎','Crystal'],['🪙','Coin'],['🎁','Gift Box'],['🧸','Teddy Bear'],['🧩','Puzzle'],['🪅','Piñata'],['🎀','Ribbon'],['🎲','Dice'],['🪆','Doll'],['🧵','Thread']],
 Nature:[['🍄','Mushroom'],['🌸','Flower'],['🌿','Herb'],['🪷','Lotus'],['🌻','Sunflower'],['🍁','Leaf'],['🌰','Acorn'],['🪸','Coral']],
 Oddities:[['🧦','Sock'],['🧀','Cheese Wheel'],['🍌','Banana'],['🪥','Toothbrush'],['🧻','Toilet Paper'],['🫧','Soap Bubble'],['🦆','Rubber Duck'],['🪣','Bucket'],['🥨','Pretzel'],['🪩','Disco Ball'],['🪠','Plunger'],['🪁','Kite']]
 };
 const adjectives=['Amber','Ancient','Arcane','Astral','Azure','Bamboozling','Bashful','Bouncy','Brave','Bubblegum','Celestial','Charming','Cheerful','Cloudy','Cosmic','Crystal','Cuddly','Curious','Dancing','Dazzling','Dewy','Dizzy','Dreamy','Enchanted','Eternal','Fabled','Feathery','Fluffy','Forgotten','Frostbound','Fuzzy','Galactic','Giggling','Glittering','Golden','Grumpy','Harmonic','Heavenly','Heroic','Hollow','Honeyed','Invisible','Iridescent','Jolly','Jumpy','Luminous','Lunar','Marshmallow','Midnight','Mischievous','Misty','Moonlit','Mysterious','Nebulous','Noodle','Opaline','Peachy','Peculiar','Pearly','Peppermint','Prismatic','Puffy','Radiant','Royal','Runic','Shimmering','Sleepy','Snickering','Solar','Sparkling','Spectral','Starlit','Sugary','Sunny','Thunderous','Ticklish','Timeless','Tiny','Twinkling','Velvet','Wiggly','Wobbly','Wonderous'];
 const materials=['Amethyst','Bubble','Candy','Cloud','Copper','Crystal','Dragonbone','Dream','Ember','Emerald','Fae','Frost','Glass','Gold','Iron','Jade','Moonstone','Obsidian','Paper','Pearl','Platinum','Plush','Quartz','Rainbow','Rosegold','Runestone','Sapphire','Shadow','Silver','Stardust','Sunstone','Velvet','Void','Wooden'];
 const suffixThings=['Adventure','Awkward Silence','Baffling Luck','Bananas','Bears','Bewilderment','Bubbles','Cats','Chaos','Cheese','Courage','Dancing Dragons','Daydreams','Destiny','Dragons','Dreams','Echoes','Eternal Confusion','Fairies','Fireflies','Forgotten Stars','Fortune','Friendship','Giggles','Glitter','Happy Accidents','Infinite Regret','Jellybeans','Joy','Lost Socks','Mischief','Moonbeams','Mystery','Naps','Noodles','Northern Winds','Odd Decisions','Phoenixes','Pigeons','Pudding','Rainbows','Sleepy Slimes','Sparkles','Star-Eaters','Starlight','Sunflowers','Tea Time','The Ancient Cat','The Last Emperor','The Tiny Wizard','Thunder','Unicorns','Very Fast Maybe','Wishes','Wonder','Yesterday'];
 const realms=['Aeloria','Aether','Auroria','Bellaris','Bramblebrook','Celestria','Duskfall','Eldervale','Fablemere','Glimmerfen','Lunaria','Moonhaven','Myrr','Nimboria','Oakenreach','Pipshire','Puddleton','Silversong','Starfall','Thornwood','Veloria','Whispergrove'];
 const syllables1=['ae','al','ar','bel','bri','ca','cel','dra','el','fa','fen','glo','ka','ki','lun','mar','mi','na','ny','ora','phi','qua','ri','sha','sol','tha','ul','va','wyn','xel','yra','zel'];
 const syllables2=['ba','bel','chi','da','del','dra','fen','fia','gli','ira','ka','kor','la','lia','lin','lo','mi','mon','na','nel','phi','ra','ria','ron','si','sha','ta','the','tor','va','ven','wyn','za'];
 const syllables3=['a','ah','ar','elle','en','eth','ia','iel','in','ion','is','ith','ora','os','oth','riel','rin','ros','une','wyn','ya'];
 const achievements=[
 ['first','🎉','First Spark','Forge your first item',s=>s.total>=1],['ten','🔨','Apprentice Crafter','Forge 10 items',s=>s.total>=10],['hundred','⚒️','Forge Enthusiast','Forge 100 items',s=>s.total>=100],['fivehundred','💪','Master Tinkerer','Forge 500 items',s=>s.total>=500],['thousand','👑','One Thousand Wonders','Forge 1,000 items',s=>s.total>=1000],['tenk','🌟','Legend of the Forge','Forge 10,000 items',s=>s.total>=10000],
 ['unique10','🎒','Treasure Hunter','Find 10 unique items',s=>s.unique>=10],['unique100','🪄','Curator of Curiosities','Find 100 unique items',s=>s.unique>=100],['unique500','🏛️','Museum Owner','Find 500 unique items',s=>s.unique>=500],['unique1000','🧙','Infinite Collector','Find 1,000 unique items',s=>s.unique>=1000],['duplicate','📦','Déjà Vu','Forge an exact duplicate',s=>s.duplicates>=1],
 ['prefix','✨','A Little Extra','Discover an item with a prefix',s=>s.prefix>=1],['suffix','🎀','Fancy Ending','Discover an item with a suffix',s=>s.suffix>=1],['both','💫','Double Enchantment','Discover an item with both affixes',s=>s.both>=1],['noaffix','🌱','Simple Pleasures','Discover an item with no affixes',s=>s.none>=1],
 ['uncommon','🍀','A Touch of Green','Discover an Uncommon item',s=>s.rarity.Uncommon>=1],['magic','🔹','Magical Moment','Discover a Magic item',s=>s.rarity.Magic>=1],['rare','💠','Rare Find','Discover a Rare item',s=>s.rarity.Rare>=1],['epic','🔮','Epic Surprise','Discover an Epic item',s=>s.rarity.Epic>=1],['legendary','👑','Golden Glory','Discover a Legendary item',s=>s.rarity.Legendary>=1],['mythic','🌸','Mythical Magic','Discover a Mythic item',s=>s.rarity.Mythic>=1],['rainbow','🌈','OVER THE RAINBOW!','Discover a Rainbow item',s=>s.rarity.Rainbow>=1],['rainbow3','🦄','Rainbow Royalty','Discover 3 Rainbow items',s=>s.rarity.Rainbow>=3],['categories','🧺','A Bit of Everything','Discover an item from all 8 categories',s=>Object.keys(s.categories).filter(x=>s.categories[x]>0).length>=8],['affixes100','📜','Word Wizard','Discover 100 different affixes',s=>s.distinctAffixes>=100]
 ];
 return {rarities,categories,adjectives,materials,suffixThings,realms,syllables1,syllables2,syllables3,achievements};
})();
