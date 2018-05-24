requirejs(['require-config'], function() {
    requirejs(['Forward', 'main/api/diff/UpdateDiff', 'main/api/diff/Path'], function(Forward, UpdateDiff, Path) {

        //Forward.vdb.array_var = ['bla1', 'bla2', 'bla3'];
        //Forward.display('demoapp/templates/template2.fwd');

        var product_names = ['Microsoft Surface Book', 'Lenovo ThinkPad W540', 'MSI GT80 Titan SLI',
            'Gigabyte P37X', 'Apple MacBook Air',
            'HP Pavilion x360 13', 'Dell XPS 13', 'Lenovo ThinkPad X250', 'Lenovo ThinkPad T450s',
            'Toshiba Satellite C55DT',  'Apple MacBook (2015)',
            'HP Spectre x360', 'Lenovo Yoga 900', 'Microsoft Surface Book', 'Dell Chromebook 13',
            'Apple iMac', 'Asus Zen AiO Pro Z240IC',
            'Origin Genesis (2015)', 'HP Envy Phoenix', 'MSI 24GE All-in-One',
            'Lenovo ThinkCentre M83 Tiny in One', 'Dell OptiPlex 9020 Micro', 'Zotac Zbox Magnus EN970',
            'Acer Revo RL85', 'Intel Compute Stick', 'Apple iMac with Retina 5K Display (2015)',
            'Microsoft Surface Pro 4', 'Samsung Galaxy Tab S2 8.0', 'Lenovo Tab 2 A10', 'Dell Venue 10 7000',
            'Apple iPad Pro', 'Asus ZenPad S 8.0', 'Amazon Fire', 'Lenovo Yoga Tablet 2 (8-Inch Windows)',
            'Microsoft Surface Pro 4', 'Amazon Kindle Paperwhite (2015)', "	HP's Instant Ink Line",
            'Canon Maxify iB4020', 'Epson SureColor P800', 'Epson WorkForce Pro WF-5690', 'Epson WorkForce ET-4550 EcoTank',
            'Canon Color ImageClass MF820Cdn', 'OKI B412dn Monochrome Printer', 'OKI MB492 Multifunction Printer',
            'Brother MFC-J6520DW', 'Seagate Backup Plus Desktop Drive (8TB)', 'Seagate Wireless (500GB)',
            'Seagate Backup Plus (4TB)', 'Samsung SSD 850 EVO (2TB)', 'Intel SSD 750 Series', 'Crucial MX200',
            'Seagate Personal Cloud (2-Bay)','QNAP TS-469L', 'D-Link AC3200 Ultra Wi-Fi Router (DIR-890L/R)',
            'Corsair Strafe', 'Logitech G910 Orion Spark', 'Corsair Gaming K65 RGB', 'Roccat Tyon',
            'Cougar 600M Gaming Mouse', 'Logitech MX Master', 'Logitech MX Anywhere 2', 'Dell UltraSharp U3415W',
            'Acer H257HU', 'BenQ XL2730Z', 'Lenovo ThinkPad Stack ', 'Apple iPhone 6s', 'Google Nexus 6P',
            'Apple iPhone, 6s Plus', 'Pebble Time', 'Marshall Kilburn', 'Sennheiser HD 598', 'Olympus Toug,  TG-4',
            'Samsung NX1', 'Olympus PEN E-PL6', 'Canon E, S Rebel T6s', 'Roku 4', 'Nvidia Shield',
            'Alienware 15 (with Graphics Amplifier)', 'Asus Transformer Book T100HA', 'Asus Chromebook Flip C100'
        ];


        var products =[];
        for (var i = 0; i< product_names.length; i++) {
            if (i === 1) {
                products.push(
                    {
                        id: i,
                        name: product_names[i],
                        user_rating: 10, //chance.floating({fixed: 2, min: 2, max: 5}),
                        units_in_stock : 144, //chance.floating({fixed: 0, min: 2, max: 700}),
                        release_year : 2015 //chance.floating({fixed: 0, min: 2011, max: 2016})
                    }
                )
            }
            else {
                products.push(
                    {
                        id: i,
                        name: product_names[i],
                        user_rating: 5, //chance.floating({fixed: 2, min: 2, max: 5}),
                        units_in_stock : 144, //chance.floating({fixed: 0, min: 2, max: 700}),
                        release_year : 2015 //chance.floating({fixed: 0, min: 2011, max: 2016})
                    }
                )
            }
        }

        Forward.vdb.products = products;
        Forward.display('demoapps/html-full-evaluation/html-template.fwd');





        window.setInterval(function() {
            var json = Math.random();
            var update_diff = new UpdateDiff(new Path('products[1].user_rating'), json);
            Forward.applyDiffs([update_diff]);
        }, 1000);


    });
});
