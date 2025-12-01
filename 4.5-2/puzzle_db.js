// ================================================================
// 填字游戏题库 - 18x18网格
// 词汇范围：基础英语单词
// 难度：easy(6-8词), medium(10-12词), hard(14-16词)
// ================================================================

const PUZZLE_DB = {
    version: "2.0.0",
    puzzles: {
        
        // ============================================================
        // 简单难度 - 6-8个单词
        // ============================================================
        easy: [
            // ----- 简单 第1题：动物主题 -----
            {
                gridSize: { rows: 18, cols: 18 },
                words: [
                    { w: "ELEPHANT", r: 2, c: 3, d: "H", h: "The largest land animal with a long trunk", n: 1 },
                    { w: "TIGER", r: 4, c: 5, d: "H", h: "A big cat with orange and black stripes", n: 2 },
                    { w: "MONKEY", r: 6, c: 2, d: "H", h: "An animal that loves bananas and climbing", n: 3 },
                    { w: "DOLPHIN", r: 8, c: 6, d: "H", h: "A smart sea animal that can jump high", n: 4 },
                    { w: "RABBIT", r: 10, c: 4, d: "H", h: "A small animal with long ears", n: 5 },
                    { w: "CAMEL", r: 2, c: 5, d: "V", h: "Desert animal with one or two humps", n: 6 },
                    { w: "DOG", r: 4, c: 9, d: "V", h: "Man's best friend, it barks", n: 7 },
                    { w: "CAT", r: 6, c: 3, d: "V", h: "A pet that says meow", n: 8 }
                ]
            },
            
            // ----- 简单 第2题：食物主题 -----
            {
                gridSize: { rows: 18, cols: 18 },
                words: [
                    { w: "BANANA", r: 2, c: 2, d: "H", h: "A yellow curved fruit", n: 1 },
                    { w: "APPLE", r: 4, c: 4, d: "H", h: "A red or green round fruit", n: 2 },
                    { w: "ORANGE", r: 6, c: 3, d: "H", h: "A citrus fruit, also a color", n: 3 },
                    { w: "BREAD", r: 8, c: 5, d: "H", h: "Made from flour, used for sandwiches", n: 4 },
                    { w: "CHEESE", r: 10, c: 2, d: "H", h: "Yellow dairy product, mice love it", n: 5 },
                    { w: "RICE", r: 12, c: 6, d: "H", h: "White grains, popular in Asia", n: 6 },
                    { w: "BUTTER", r: 2, c: 2, d: "V", h: "Spread it on bread", n: 1 },
                    { w: "EGG", r: 6, c: 8, d: "V", h: "Laid by a chicken", n: 7 }
                ]
            },
            
            // ----- 简单 第3题：家庭主题 -----
            {
                gridSize: { rows: 18, cols: 18 },
                words: [
                    { w: "MOTHER", r: 3, c: 2, d: "H", h: "Your female parent", n: 1 },
                    { w: "FATHER", r: 5, c: 4, d: "H", h: "Your male parent", n: 2 },
                    { w: "SISTER", r: 7, c: 3, d: "H", h: "Your parents' daughter", n: 3 },
                    { w: "BROTHER", r: 9, c: 2, d: "H", h: "Your parents' son", n: 4 },
                    { w: "BABY", r: 11, c: 5, d: "H", h: "A very young child", n: 5 },
                    { w: "FAMILY", r: 3, c: 2, d: "V", h: "Parents and children together", n: 1 },
                    { w: "SON", r: 7, c: 6, d: "V", h: "A male child", n: 6 },
                    { w: "HOME", r: 5, c: 9, d: "V", h: "Where your family lives", n: 7 }
                ]
            },
            
            // ----- 简单 第4题：颜色主题 -----
            {
                gridSize: { rows: 18, cols: 18 },
                words: [
                    { w: "YELLOW", r: 2, c: 3, d: "H", h: "The color of the sun", n: 1 },
                    { w: "GREEN", r: 4, c: 5, d: "H", h: "The color of grass and leaves", n: 2 },
                    { w: "BLUE", r: 6, c: 4, d: "H", h: "The color of the sky", n: 3 },
                    { w: "WHITE", r: 8, c: 2, d: "H", h: "The color of snow", n: 4 },
                    { w: "BLACK", r: 10, c: 6, d: "H", h: "The darkest color", n: 5 },
                    { w: "PINK", r: 12, c: 3, d: "H", h: "Light red color", n: 6 },
                    { w: "GREY", r: 2, c: 4, d: "V", h: "Between black and white", n: 7 },
                    { w: "RED", r: 6, c: 7, d: "V", h: "The color of blood", n: 8 }
                ]
            },
            
            // ----- 简单 第5题：身体部位 -----
            {
                gridSize: { rows: 18, cols: 18 },
                words: [
                    { w: "HEAD", r: 2, c: 4, d: "H", h: "Top part of your body", n: 1 },
                    { w: "HAND", r: 4, c: 3, d: "H", h: "You have five fingers on each", n: 2 },
                    { w: "FOOT", r: 6, c: 5, d: "H", h: "You walk with these", n: 3 },
                    { w: "EYE", r: 8, c: 2, d: "H", h: "You see with these", n: 4 },
                    { w: "EAR", r: 10, c: 6, d: "H", h: "You hear with these", n: 5 },
                    { w: "NOSE", r: 12, c: 4, d: "H", h: "You smell with this", n: 6 },
                    { w: "ARM", r: 2, c: 6, d: "V", h: "Between shoulder and hand", n: 7 },
                    { w: "LEG", r: 6, c: 8, d: "V", h: "Between hip and foot", n: 8 }
                ]
            }
        ],
        
        // ============================================================
        // 中等难度 - 10-12个单词
        // ============================================================
        medium: [
            // ----- 中等 第1题：学校主题 -----
            {
                gridSize: { rows: 18, cols: 18 },
                words: [
                    { w: "SCHOOL", r: 1, c: 2, d: "H", h: "Place where students learn", n: 1 },
                    { w: "TEACHER", r: 3, c: 4, d: "H", h: "Person who teaches students", n: 2 },
                    { w: "STUDENT", r: 5, c: 3, d: "H", h: "Person who studies at school", n: 3 },
                    { w: "BOOK", r: 7, c: 6, d: "H", h: "You read this to learn", n: 4 },
                    { w: "PENCIL", r: 9, c: 2, d: "H", h: "Writing tool made of wood", n: 5 },
                    { w: "DESK", r: 11, c: 5, d: "H", h: "Table where you sit and study", n: 6 },
                    { w: "CLASS", r: 13, c: 3, d: "H", h: "Group of students learning together", n: 7 },
                    { w: "HOMEWORK", r: 15, c: 1, d: "H", h: "Work you do at home for school", n: 8 },
                    { w: "SCIENCE", r: 1, c: 2, d: "V", h: "Subject about nature and experiments", n: 1 },
                    { w: "LIBRARY", r: 3, c: 10, d: "V", h: "Room full of books", n: 9 },
                    { w: "EXAM", r: 7, c: 6, d: "V", h: "Test to check your knowledge", n: 4 },
                    { w: "PEN", r: 11, c: 8, d: "V", h: "Writing tool with ink", n: 10 }
                ]
            },
            
            // ----- 中等 第2题：城市生活 -----
            {
                gridSize: { rows: 18, cols: 18 },
                words: [
                    { w: "HOSPITAL", r: 1, c: 3, d: "H", h: "Place where sick people go", n: 1 },
                    { w: "AIRPORT", r: 3, c: 2, d: "H", h: "Place where planes take off", n: 2 },
                    { w: "RESTAURANT", r: 5, c: 1, d: "H", h: "Place to eat meals", n: 3 },
                    { w: "HOTEL", r: 7, c: 5, d: "H", h: "Place to stay when traveling", n: 4 },
                    { w: "SUPERMARKET", r: 9, c: 0, d: "H", h: "Big shop for food and goods", n: 5 },
                    { w: "CINEMA", r: 11, c: 4, d: "H", h: "Place to watch movies", n: 6 },
                    { w: "BANK", r: 13, c: 6, d: "H", h: "Place to keep money", n: 7 },
                    { w: "MUSEUM", r: 15, c: 3, d: "H", h: "Place to see art and history", n: 8 },
                    { w: "ROAD", r: 1, c: 5, d: "V", h: "Cars drive on this", n: 9 },
                    { w: "TRAIN", r: 3, c: 8, d: "V", h: "Travels on railway tracks", n: 10 },
                    { w: "TAXI", r: 7, c: 9, d: "V", h: "Car you pay to ride in", n: 11 },
                    { w: "BUS", r: 11, c: 4, d: "V", h: "Big vehicle for many passengers", n: 6 }
                ]
            },
            
            // ----- 中等 第3题：天气与自然 -----
            {
                gridSize: { rows: 18, cols: 18 },
                words: [
                    { w: "WEATHER", r: 1, c: 2, d: "H", h: "Rain, sun, snow - what's it like outside", n: 1 },
                    { w: "SUNNY", r: 3, c: 4, d: "H", h: "When the sun is shining", n: 2 },
                    { w: "CLOUDY", r: 5, c: 3, d: "H", h: "When the sky is full of clouds", n: 3 },
                    { w: "RAIN", r: 7, c: 6, d: "H", h: "Water falling from the sky", n: 4 },
                    { w: "SNOW", r: 9, c: 2, d: "H", h: "White frozen water from sky", n: 5 },
                    { w: "WIND", r: 11, c: 5, d: "H", h: "Moving air you can feel", n: 6 },
                    { w: "STORM", r: 13, c: 3, d: "H", h: "Bad weather with thunder", n: 7 },
                    { w: "FOREST", r: 15, c: 4, d: "H", h: "Area with many trees", n: 8 },
                    { w: "WINTER", r: 1, c: 2, d: "V", h: "The coldest season", n: 1 },
                    { w: "SUMMER", r: 3, c: 8, d: "V", h: "The hottest season", n: 9 },
                    { w: "SPRING", r: 7, c: 6, d: "V", h: "Season when flowers bloom", n: 4 },
                    { w: "TREE", r: 11, c: 9, d: "V", h: "Tall plant with leaves", n: 10 }
                ]
            },
            
            // ----- 中等 第4题：职业主题 -----
            {
                gridSize: { rows: 18, cols: 18 },
                words: [
                    { w: "DOCTOR", r: 1, c: 3, d: "H", h: "Person who helps sick people", n: 1 },
                    { w: "NURSE", r: 3, c: 5, d: "H", h: "Helps doctors care for patients", n: 2 },
                    { w: "POLICE", r: 5, c: 2, d: "H", h: "Keeps people safe from crime", n: 3 },
                    { w: "DRIVER", r: 7, c: 4, d: "H", h: "Person who drives vehicles", n: 4 },
                    { w: "CHEF", r: 9, c: 6, d: "H", h: "Cooks food in restaurant", n: 5 },
                    { w: "FARMER", r: 11, c: 3, d: "H", h: "Grows food on a farm", n: 6 },
                    { w: "ARTIST", r: 13, c: 5, d: "H", h: "Creates paintings and art", n: 7 },
                    { w: "SINGER", r: 15, c: 2, d: "H", h: "Person who sings songs", n: 8 },
                    { w: "DANCER", r: 1, c: 3, d: "V", h: "Person who dances", n: 1 },
                    { w: "PILOT", r: 3, c: 9, d: "V", h: "Flies airplanes", n: 9 },
                    { w: "WRITER", r: 7, c: 4, d: "V", h: "Creates books and stories", n: 4 },
                    { w: "ACTOR", r: 11, c: 8, d: "V", h: "Performs in movies or plays", n: 10 }
                ]
            },
            
            // ----- 中等 第5题：运动主题 -----
            {
                gridSize: { rows: 18, cols: 18 },
                words: [
                    { w: "FOOTBALL", r: 1, c: 2, d: "H", h: "Popular sport with a round ball", n: 1 },
                    { w: "SWIMMING", r: 3, c: 3, d: "H", h: "Sport in water", n: 2 },
                    { w: "TENNIS", r: 5, c: 4, d: "H", h: "Sport with rackets and a ball", n: 3 },
                    { w: "RUNNING", r: 7, c: 2, d: "H", h: "Moving fast on your feet", n: 4 },
                    { w: "GOLF", r: 9, c: 6, d: "H", h: "Sport with clubs and small ball", n: 5 },
                    { w: "HOCKEY", r: 11, c: 3, d: "H", h: "Sport on ice with sticks", n: 6 },
                    { w: "CYCLING", r: 13, c: 4, d: "H", h: "Riding a bicycle as sport", n: 7 },
                    { w: "SKIING", r: 15, c: 5, d: "H", h: "Winter sport on snow", n: 8 },
                    { w: "TEAM", r: 1, c: 6, d: "V", h: "Group playing together", n: 9 },
                    { w: "WINNER", r: 3, c: 9, d: "V", h: "Person who wins", n: 10 },
                    { w: "GAME", r: 7, c: 2, d: "V", h: "Match or competition", n: 4 },
                    { w: "GYM", r: 11, c: 8, d: "V", h: "Place to exercise", n: 11 }
                ]
            }
        ],
        
        // ============================================================
        // 困难难度 - 14-16个单词
        // ============================================================
        hard: [
            // ----- 困难 第1题：综合词汇 -----
            {
                gridSize: { rows: 18, cols: 18 },
                words: [
                    { w: "COMPUTER", r: 0, c: 2, d: "H", h: "Electronic device for work and games", n: 1 },
                    { w: "KEYBOARD", r: 2, c: 1, d: "H", h: "You type letters with this", n: 2 },
                    { w: "INTERNET", r: 4, c: 3, d: "H", h: "Global network connecting computers", n: 3 },
                    { w: "TELEPHONE", r: 6, c: 0, d: "H", h: "Device for talking to people far away", n: 4 },
                    { w: "TELEVISION", r: 8, c: 1, d: "H", h: "Watch programs and movies on this", n: 5 },
                    { w: "CAMERA", r: 10, c: 4, d: "H", h: "Takes photos", n: 6 },
                    { w: "PHOTOGRAPH", r: 12, c: 0, d: "H", h: "Picture taken by camera", n: 7 },
                    { w: "DICTIONARY", r: 14, c: 2, d: "H", h: "Book with word meanings", n: 8 },
                    { w: "NEWSPAPER", r: 16, c: 1, d: "H", h: "Daily printed news", n: 9 },
                    { w: "CHOCOLATE", r: 0, c: 2, d: "V", h: "Sweet brown candy", n: 1 },
                    { w: "BREAKFAST", r: 2, c: 8, d: "V", h: "First meal of the day", n: 10 },
                    { w: "UMBRELLA", r: 4, c: 11, d: "V", h: "Keeps you dry in rain", n: 11 },
                    { w: "BEAUTIFUL", r: 6, c: 5, d: "V", h: "Very pretty or attractive", n: 12 },
                    { w: "MAGAZINE", r: 8, c: 10, d: "V", h: "Weekly or monthly publication", n: 13 },
                    { w: "DIFFERENT", r: 10, c: 4, d: "V", h: "Not the same", n: 6 },
                    { w: "IMPORTANT", r: 12, c: 7, d: "V", h: "Very significant or valuable", n: 14 }
                ]
            },
            
            // ----- 困难 第2题：日常生活 -----
            {
                gridSize: { rows: 18, cols: 18 },
                words: [
                    { w: "APARTMENT", r: 0, c: 3, d: "H", h: "A flat in a building", n: 1 },
                    { w: "BATHROOM", r: 2, c: 2, d: "H", h: "Room with toilet and shower", n: 2 },
                    { w: "KITCHEN", r: 4, c: 4, d: "H", h: "Room where you cook", n: 3 },
                    { w: "BEDROOM", r: 6, c: 1, d: "H", h: "Room where you sleep", n: 4 },
                    { w: "FURNITURE", r: 8, c: 2, d: "H", h: "Tables, chairs, sofas etc.", n: 5 },
                    { w: "CUPBOARD", r: 10, c: 3, d: "H", h: "Cabinet for storing things", n: 6 },
                    { w: "CURTAIN", r: 12, c: 4, d: "H", h: "Cloth covering a window", n: 7 },
                    { w: "BLANKET", r: 14, c: 2, d: "H", h: "Warm cover for the bed", n: 8 },
                    { w: "WARDROBE", r: 16, c: 1, d: "H", h: "Closet for clothes", n: 9 },
                    { w: "BICYCLE", r: 0, c: 3, d: "V", h: "Two-wheeled vehicle", n: 1 },
                    { w: "APARTMENT", r: 2, c: 9, d: "V", h: "Place to live in a building", n: 10 },
                    { w: "WASHING", r: 4, c: 11, d: "V", h: "Cleaning clothes", n: 11 },
                    { w: "COOKING", r: 6, c: 7, d: "V", h: "Making food", n: 12 },
                    { w: "SHOPPING", r: 8, c: 10, d: "V", h: "Buying things from stores", n: 13 },
                    { w: "CLEANING", r: 10, c: 3, d: "V", h: "Making things tidy", n: 6 },
                    { w: "SLEEPING", r: 12, c: 12, d: "V", h: "Resting at night", n: 14 }
                ]
            },
            
            // ----- 困难 第3题：旅行主题 -----
            {
                gridSize: { rows: 18, cols: 18 },
                words: [
                    { w: "PASSENGER", r: 0, c: 2, d: "H", h: "Person traveling in a vehicle", n: 1 },
                    { w: "SUITCASE", r: 2, c: 3, d: "H", h: "Bag for travel clothes", n: 2 },
                    { w: "PASSPORT", r: 4, c: 1, d: "H", h: "Document for international travel", n: 3 },
                    { w: "TICKET", r: 6, c: 4, d: "H", h: "Paper to enter or travel", n: 4 },
                    { w: "VACATION", r: 8, c: 2, d: "H", h: "Holiday time off work", n: 5 },
                    { w: "ADVENTURE", r: 10, c: 0, d: "H", h: "Exciting experience or journey", n: 6 },
                    { w: "COUNTRY", r: 12, c: 3, d: "H", h: "A nation like China or USA", n: 7 },
                    { w: "MOUNTAIN", r: 14, c: 2, d: "H", h: "Very high land formation", n: 8 },
                    { w: "BEACH", r: 16, c: 5, d: "H", h: "Sandy area by the sea", n: 9 },
                    { w: "PLATFORM", r: 0, c: 2, d: "V", h: "Where you wait for trains", n: 1 },
                    { w: "RAILWAY", r: 2, c: 10, d: "V", h: "Tracks for trains", n: 10 },
                    { w: "LUGGAGE", r: 4, c: 8, d: "V", h: "Bags you take when traveling", n: 11 },
                    { w: "JOURNEY", r: 6, c: 4, d: "V", h: "Trip from one place to another", n: 4 },
                    { w: "TOURIST", r: 8, c: 9, d: "V", h: "Person visiting a place", n: 12 },
                    { w: "ISLAND", r: 10, c: 6, d: "V", h: "Land surrounded by water", n: 13 },
                    { w: "OCEAN", r: 12, c: 11, d: "V", h: "Very large sea", n: 14 }
                ]
            },
            
            // ----- 困难 第4题：购物与金钱 -----
            {
                gridSize: { rows: 18, cols: 18 },
                words: [
                    { w: "CUSTOMER", r: 0, c: 2, d: "H", h: "Person who buys things", n: 1 },
                    { w: "SHOPPING", r: 2, c: 3, d: "H", h: "Activity of buying things", n: 2 },
                    { w: "EXPENSIVE", r: 4, c: 1, d: "H", h: "Costs a lot of money", n: 3 },
                    { w: "DISCOUNT", r: 6, c: 2, d: "H", h: "Reduced price, on sale", n: 4 },
                    { w: "RECEIPT", r: 8, c: 4, d: "H", h: "Paper showing what you paid", n: 5 },
                    { w: "CREDIT", r: 10, c: 3, d: "H", h: "Buy now, pay later", n: 6 },
                    { w: "WALLET", r: 12, c: 5, d: "H", h: "Small case for money and cards", n: 7 },
                    { w: "CHANGE", r: 14, c: 2, d: "H", h: "Coins you get back", n: 8 },
                    { w: "MARKET", r: 16, c: 4, d: "H", h: "Place to buy and sell", n: 9 },
                    { w: "CLOTHES", r: 0, c: 2, d: "V", h: "Things you wear", n: 1 },
                    { w: "SHOES", r: 2, c: 10, d: "V", h: "You wear these on your feet", n: 10 },
                    { w: "JACKET", r: 4, c: 9, d: "V", h: "Short coat", n: 11 },
                    { w: "PRICE", r: 6, c: 7, d: "V", h: "How much something costs", n: 12 },
                    { w: "DOLLAR", r: 8, c: 4, d: "V", h: "American money", n: 5 },
                    { w: "POUND", r: 10, c: 8, d: "V", h: "British money", n: 13 },
                    { w: "CASH", r: 12, c: 11, d: "V", h: "Money in coins and notes", n: 14 }
                ]
            },
            
            // ----- 困难 第5题：情感与特征 -----
            {
                gridSize: { rows: 18, cols: 18 },
                words: [
                    { w: "WONDERFUL", r: 0, c: 2, d: "H", h: "Extremely good, amazing", n: 1 },
                    { w: "FANTASTIC", r: 2, c: 1, d: "H", h: "Very good, excellent", n: 2 },
                    { w: "HORRIBLE", r: 4, c: 3, d: "H", h: "Very bad or scary", n: 3 },
                    { w: "SURPRISED", r: 6, c: 0, d: "H", h: "Feeling of shock", n: 4 },
                    { w: "EXCITED", r: 8, c: 2, d: "H", h: "Very happy and eager", n: 5 },
                    { w: "WORRIED", r: 10, c: 3, d: "H", h: "Feeling anxious about something", n: 6 },
                    { w: "FRIENDLY", r: 12, c: 1, d: "H", h: "Kind and nice to others", n: 7 },
                    { w: "DANGEROUS", r: 14, c: 0, d: "H", h: "Could cause harm", n: 8 },
                    { w: "COMFORTABLE", r: 16, c: 1, d: "H", h: "Feeling relaxed and at ease", n: 9 },
                    { w: "DIFFICULT", r: 0, c: 7, d: "V", h: "Not easy, hard to do", n: 10 },
                    { w: "INTERESTING", r: 2, c: 10, d: "V", h: "Makes you want to learn more", n: 11 },
                    { w: "DELICIOUS", r: 4, c: 3, d: "V", h: "Tastes very good", n: 3 },
                    { w: "PERFECT", r: 6, c: 8, d: "V", h: "Without any mistakes", n: 12 },
                    { w: "STRANGE", r: 8, c: 9, d: "V", h: "Unusual or weird", n: 13 },
                    { w: "LUCKY", r: 10, c: 8, d: "V", h: "Having good fortune", n: 14 },
                    { w: "HUNGRY", r: 12, c: 6, d: "V", h: "Wanting to eat", n: 15 }
                ]
            }
        ]
    }
};