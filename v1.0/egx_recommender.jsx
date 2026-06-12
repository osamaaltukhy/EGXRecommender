import { useState, useMemo } from "react";

const EGX_DATA = {"AIDC":{"symbol":"AIDC","name":"Arabia for Investment and Development","sector":"Finance","industry":"FinancialServices","shariah":false},"ICEB":{"symbol":"ICEB","name":"International Company for Engineering and Building","sector":"Construction","industry":"Construction","shariah":true},"MOSC":{"symbol":"MOSC","name":"Misr Oils & Soap","sector":"ConsumerGoods","industry":"FoodBeverages","shariah":true,"vol20d":0.785,"momentum":-0.066,"pb":2.307,"mcap":300600000},"DEIN":{"symbol":"DEIN","name":"Delta Insurance","sector":"Finance","industry":"FinancialServices","shariah":false,"vol20d":0.0,"momentum":0.0,"pb":0.593,"mcap":1778749952,"peers":["MOIN"]},"DTPP":{"symbol":"DTPP","name":"Delta for Printing & Packaging","sector":"BasicMaterials","industry":"Chemicals","shariah":true,"vol20d":0.67,"momentum":-0.051,"pb":1.068,"mcap":237216000,"peers":["NAPR"]},"NAPR":{"symbol":"NAPR","name":"National Printing Company S.A.E.","sector":"ConsumerServices","industry":"ConsumerServices","shariah":true,"peers":["DTPP"]},"GGRN":{"symbol":"GGRN","name":"Go Green For Agricultural Investment And Development","sector":"Finance","industry":"FinancialServices","shariah":false,"peers":["AALR"]},"GTWL":{"symbol":"GTWL","name":"Golden Textiles & Clothes Wool","sector":"BasicMaterials","industry":"Chemicals","shariah":true,"vol20d":0.465,"momentum":0.152,"pb":0.438,"mcap":424073088,"peers":["ACGC"]},"LUTS":{"symbol":"LUTS","name":"Lotus Agri Capital","sector":"Finance","industry":"FinancialServices","shariah":false,"mcap":450449984,"peers":["AALR"]},"NDRL":{"symbol":"NDRL","name":"National Drilling Company","sector":"Energy","industry":"OilGas","shariah":true,"vol20d":0.0,"momentum":0.0,"pb":0.439,"mcap":23450000,"peers":["EGAS"]},"TALM":{"symbol":"TALM","name":"Taaleem Management Services","sector":"ConsumerServices","industry":"Tourism","shariah":true,"pb":3.05,"pe":10.0,"mcap":5872297472,"peers":["CAED"],"indices":["EGX30"]},"CAED":{"symbol":"CAED","name":"Cairo Educational Services","sector":"ConsumerServices","industry":"Tourism","shariah":true,"vol20d":0.346,"momentum":0.269,"pb":2.869,"mcap":253680000,"peers":["CIRA"]},"KRDI":{"symbol":"KRDI","name":"AlKhair River for Development Agricultural Investment","sector":"ConsumerGoods","industry":"FoodBeverages","shariah":true,"peers":["AALR"]},"TAQA":{"symbol":"TAQA","name":"TAQA Arabia S.A.E.","sector":"Electricity","industry":"Electricity","shariah":true,"peers":["EGAS"],"indices":["EGX30"]},"AMPI":{"symbol":"AMPI","name":"AL Moasher Pay for Electronic Payment","sector":"ITServices","industry":"ITServices","shariah":true,"vol20d":0.354,"momentum":-0.082,"peers":["DGTZ"]},"DGTZ":{"symbol":"DGTZ","name":"Digitize for Investment And Technology","sector":"ITServices","industry":"ITServices","shariah":true,"peers":["AMPI"]},"EITP":{"symbol":"EITP","name":"Egyptian International Tourism Projects","sector":"ConsumerServices","industry":"Tourism","shariah":true,"peers":["EGTS"],"indices":["EGX30"]},"GPPL":{"symbol":"GPPL","name":"Golden Pyramids Plaza","sector":"Finance","industry":"FinancialServices","shariah":false,"vol20d":0.05,"momentum":-0.014,"pb":1.134,"pe":36.075,"mcap":833464320,"peers":["EGTS"]},"MHOT":{"symbol":"MHOT","name":"Misr Hotels Co.","sector":"ConsumerServices","industry":"Tourism","shariah":true,"vol20d":0.153,"momentum":0.001,"pb":14.345,"pe":36.655,"mcap":48335757312,"peers":["EGTS"],"indices":["EGX30"]},"SPHT":{"symbol":"SPHT","name":"El Shams Pyramids Co. For Hotels","sector":"ConsumerServices","industry":"Tourism","shariah":true,"vol20d":0.0,"momentum":0.003,"pb":10.159,"pe":127.5,"mcap":214551936,"peers":["EGTS"],"indices":["EGX30"]},"SSTS":{"symbol":"SSTS","name":"Sues Canal Co. for Technology Settling","sector":"ConsumerServices","industry":"ConsumerServices","shariah":true,"peers":["AMPI"]},"CFGH":{"symbol":"CFGH","name":"Concrete Fashion Group","sector":"ConsumerGoods","industry":"ConsumerGoods","shariah":true,"pb":0.723,"pe":2.267,"mcap":31977000,"peers":["ALEX"]},"EALR":{"symbol":"EALR","name":"El Arabia for Land Reclamation","sector":"Finance","industry":"FinancialServices","shariah":false,"vol20d":0.419,"momentum":0.249,"pb":2.704,"mcap":190268000,"peers":["AALR"]},"EFIH":{"symbol":"EFIH","name":"e-finance for Digital and Financial Investments","sector":"ITServices","industry":"ITServices","shariah":true,"pb":10.109,"pe":35.423,"mcap":87186669568,"peers":["AMPI"],"indices":["EGX30"]},"EGSA":{"symbol":"EGSA","name":"Egyptian Satellite Co.","sector":"ConsumerServices","industry":"Tourism","shariah":true,"vol20d":0.071,"momentum":0.003,"pb":0.385,"pe":4.986,"mcap":258662128,"peers":["AMPI"],"indices":["EGX30"]},"GDWA":{"symbol":"GDWA","name":"Gadwa for Industrial Development","sector":"Finance","industry":"FinancialServices","shariah":false,"pb":8.659,"mcap":30621984768,"peers":["ALUM"]},"IRAX":{"symbol":"IRAX","name":"El Ezz Aldekhela Steel-Alexandria","sector":"BasicMaterials","industry":"Steel","shariah":true,"peers":["ALUM"],"indices":["EGX30"]},"MFPC":{"symbol":"MFPC","name":"Misr Fertilizers Production Company MOPCO","sector":"BasicMaterials","industry":"Chemicals","shariah":true,"vol20d":0.335,"momentum":0.137,"pb":2.628,"pe":11.117,"mcap":125624541184,"peers":["ABUK"],"indices":["EGX30"]},"PHTV":{"symbol":"PHTV","name":"Pyramisa Hotels & Resorts","sector":"ConsumerServices","industry":"Tourism","shariah":true,"vol20d":0.293,"momentum":-0.028,"pb":1.282,"pe":5.38,"mcap":3272938496,"peers":["EGTS"],"indices":["EGX30"]},"SAIB":{"symbol":"SAIB","name":"Société Arabe Internationale de Banque","sector":"Finance","industry":"FinancialServices","shariah":false,"vol20d":0.0,"momentum":0.0,"pb":0.173,"pe":3.297,"mcap":69846272},"ALEX":{"symbol":"ALEX","name":"Alexandria Cement Co.","sector":"BasicMaterials","industry":"Steel","shariah":true,"peers":["ARCC"]},"RUBX":{"symbol":"RUBX","name":"Rubex International for Plastic and Acrylic Manufacturing","sector":"Construction","industry":"Construction","shariah":true,"vol20d":0.442,"momentum":-0.118,"pb":2.013,"mcap":326670912,"peers":["DTPP"]},"GTHE":{"symbol":"GTHE","name":"Global Telecom Holding S.A.E.","sector":"Telecom","industry":"Telecom","shariah":true,"peers":["AMPI"],"indices":["EGX30"]},"MAAL":{"symbol":"MAAL","name":"Marseille Almasreia Alkhalegeya For Holding Investment","sector":"Finance","industry":"FinancialServices","shariah":false,"mcap":809827200,"peers":["ACAP"]},"SEIG":{"symbol":"SEIG","name":"Saudi Egyptian Investment & Finance Co.","sector":"Finance","industry":"FinancialServices","shariah":false,"vol20d":0.495,"momentum":0.005,"pb":0.697,"mcap":146274992,"peers":["ACAP"]},"VLMR":{"symbol":"VLMR","name":"Valmore Holding","sector":"Finance","industry":"FinancialServices","shariah":false,"peers":["ACAP"]},"ACTF":{"symbol":"ACTF","name":"Act Financial","sector":"Finance","industry":"FinancialServices","shariah":false,"peers":["ACAMD"]},"EOSB":{"symbol":"EOSB","name":"El Orouba Securities Brokerage","sector":"Finance","industry":"FinancialServices","shariah":false,"vol20d":0.155,"momentum":-0.026,"pb":4.69,"mcap":33895500,"peers":["ACAMD"]},"GBCO":{"symbol":"GBCO","name":"GB Corp","sector":"ConsumerGoods","industry":"ConsumerGoods","shariah":true,"pb":0.53,"pe":5.711,"mcap":15251275776,"peers":["ACAP"],"indices":["EGX30"]},"APPC":{"symbol":"APPC","name":"Advanced Pharmaceutical Packaging Co.","sector":"BasicMaterials","industry":"Chemicals","shariah":true,"peers":["ADCI"]},"IBNS":{"symbol":"IBNS","name":"Ibnsina Pharma","sector":"ConsumerGoods","industry":"ConsumerGoods","shariah":true,"peers":["ADCI"]},"KWIN":{"symbol":"KWIN","name":"El Kahera El Watania Investment","sector":"Finance","industry":"FinancialServices","shariah":false,"vol20d":0.417,"momentum":-0.091,"pb":3.012,"mcap":246015008,"peers":["ACAP"]},"MCRO":{"symbol":"MCRO","name":"Macro Group Pharmaceuticals","sector":"HealthCare","industry":"Pharmaceuticals","shariah":true,"pb":5.309,"pe":36.1,"mcap":6175335936,"peers":["ADCI"]},"CIRA":{"symbol":"CIRA","name":"CIRA Education","sector":"ConsumerServices","industry":"Tourism","shariah":true,"vol20d":0.366,"momentum":0.294,"pb":4.196,"pe":0.119,"mcap":8147408384,"peers":["CAED"],"indices":["EGX30"]},"OCPH":{"symbol":"OCPH","name":"October Pharma S.A.E","sector":"HealthCare","industry":"Pharmaceuticals","shariah":true,"pb":1.808,"mcap":1200000000,"peers":["ADCI"]},"QNBE":{"symbol":"QNBE","name":"Qatar National Bank","sector":"Finance","industry":"FinancialServices","shariah":false,"peers":["ADIB"],"indices":["EGX30"]},"EBSC":{"symbol":"EBSC","name":"Osool ESB Securities Brokerage","sector":"Finance","industry":"FinancialServices","shariah":false,"vol20d":0.39,"momentum":0.579,"pb":0.861,"mcap":170910976,"peers":["ACAMD"]},"ELNA":{"symbol":"ELNA","name":"El Nasr for Manufacturing Agricultural Crops","sector":"BasicMaterials","industry":"Chemicals","shariah":true,"vol20d":0.417,"momentum":-0.005,"pb":4.971,"mcap":120341048,"peers":["ADPC"]},"RMDA":{"symbol":"RMDA","name":"Rameda Pharmaceuticals","sector":"HealthCare","industry":"Pharmaceuticals","shariah":true,"pb":2.113,"pe":16.357,"mcap":4579999744,"peers":["ADCI"],"indices":["EGX30"]},"ADCI":{"symbol":"ADCI","name":"Arab Pharmaceuticals","sector":"HealthCare","industry":"Pharmaceuticals","shariah":true,"vol20d":0.408,"momentum":0.044,"pb":1.572,"mcap":984000000,"peers":["AMES"]},"ISMQ":{"symbol":"ISMQ","name":"Iron & Steel for Mines & Quarries","sector":"BasicMaterials","industry":"Steel","shariah":true,"pb":8.313,"mcap":4620605952,"peers":["ALUM"],"indices":["EGX30"]},"NINH":{"symbol":"NINH","name":"Nozha International Hospital","sector":"HealthCare","industry":"Hospitals","shariah":true,"vol20d":0.234,"momentum":0.067,"pb":2.211,"mcap":1965000064,"peers":["ADCI"],"indices":["EGX30"]},"AIFI":{"symbol":"AIFI","name":"Atlas for Investment & Food Industries","sector":"BasicMaterials","industry":"Chemicals","shariah":true,"vol20d":0.659,"momentum":0.097,"peers":["ADPC"]},"AXPH":{"symbol":"AXPH","name":"Alexandria Company for Pharmaceuticals","sector":"HealthCare","industry":"Pharmaceuticals","shariah":true,"vol20d":0.122,"momentum":0.239,"pb":1.06,"mcap":1053550016,"peers":["ADCI"],"indices":["EGX30"]},"COSG":{"symbol":"COSG","name":"Cairo Oils & Soap","sector":"ConsumerGoods","industry":"FoodBeverages","shariah":true,"vol20d":0.397,"momentum":0.08,"pb":0.307,"mcap":131664000,"peers":["ADPC"]},"WCDF":{"symbol":"WCDF","name":"Middle & West Delta Flour Mills","sector":"BasicMaterials","industry":"Chemicals","shariah":true,"vol20d":0.183,"momentum":0.03,"pb":1.931,"mcap":1884449920,"peers":["ADPC"]},"MOIN":{"symbol":"MOIN","name":"Mohandes Insurance Company","sector":"Finance","industry":"FinancialServices","shariah":false,"vol20d":0.291,"momentum":-0.131,"pb":2.172,"mcap":4451200000,"peers":["DEIN"],"indices":["EGX30"]},"AALR":{"symbol":"AALR","name":"General Co. for Land Reclamation","sector":"Finance","industry":"FinancialServices","shariah":false,"vol20d":0.395,"momentum":0.073,"pb":-0.484,"mcap":252913488,"peers":["EALR"]},"AMES":{"symbol":"AMES","name":"Alexandria New Medical Center","sector":"HealthCare","industry":"Hospitals","shariah":true,"vol20d":0.354,"momentum":0.179,"pb":3.145,"mcap":1678848000,"peers":["ADCI"],"indices":["EGX30"]},"EASB":{"symbol":"EASB","name":"Egyptian Arabian Company for Securities Brokerage","sector":"Finance","industry":"FinancialServices","shariah":false,"vol20d":0.255,"momentum":-0.137,"pb":2.08,"mcap":285000000,"peers":["ACAMD"]},"MIPH":{"symbol":"MIPH","name":"MINAPHARM Pharmaceuticals","sector":"HealthCare","industry":"Pharmaceuticals","shariah":true,"vol20d":0.226,"momentum":0.347,"peers":["ADCI"],"indices":["EGX30"]},"SUCE":{"symbol":"SUCE","name":"Suez Cement Co.","sector":"BasicMaterials","industry":"Steel","shariah":true,"peers":["ALEX"],"indices":["EGX30"]},"UEFM":{"symbol":"UEFM","name":"Upper Egypt Mills Company","sector":"BasicMaterials","industry":"Chemicals","shariah":true,"vol20d":0.255,"momentum":0.028,"pb":1.478,"mcap":1183769984,"peers":["ADPC"]},"NIPH":{"symbol":"NIPH","name":"El-Nile Co. for Pharmaceuticals","sector":"HealthCare","industry":"Pharmaceuticals","shariah":true,"vol20d":0.437,"momentum":0.352,"pb":3.362,"mcap":3488999936,"peers":["ADCI"],"indices":["EGX30"]},"EDFM":{"symbol":"EDFM","name":"East Delta Flour Mills","sector":"ConsumerGoods","industry":"FoodBeverages","shariah":true,"vol20d":0.22,"momentum":0.031,"pb":1.898,"mcap":1049880000,"peers":["ADPC"]},"SCFM":{"symbol":"SCFM","name":"South Cairo Flour Mills","sector":"BasicMaterials","industry":"Chemicals","shariah":true,"vol20d":0.423,"momentum":1.152,"pb":8.392,"mcap":259559984,"peers":["ADPC"]},"CPCI":{"symbol":"CPCI","name":"Kahira Pharmaceuticals","sector":"HealthCare","industry":"Pharmaceuticals","shariah":true,"vol20d":0.15,"momentum":0.281,"pb":1.02,"mcap":1037640448,"peers":["ADCI"],"indices":["EGX30"]},"UBEE":{"symbol":"UBEE","name":"The United Bank","sector":"Finance","industry":"FinancialServices","shariah":false,"peers":["ADIB"],"indices":["EGX30"]},"CEFM":{"symbol":"CEFM","name":"Middle Egypt Flour Mills","sector":"BasicMaterials","industry":"Chemicals","shariah":true,"vol20d":0.264,"momentum":0.119,"pb":1.937,"mcap":821539776,"peers":["ADPC"]},"IRON":{"symbol":"IRON","name":"Egyptian Iron & Steel","sector":"BasicMaterials","industry":"Steel","shariah":true,"vol20d":0.337,"momentum":0.308,"pb":-9.638,"mcap":48140263424,"peers":["ALUM"]},"APSW":{"symbol":"APSW","name":"Arab Polvara Spinning & Weaving","sector":"BasicMaterials","industry":"Chemicals","shariah":true,"vol20d":0.26,"momentum":0.005,"pb":15.071,"mcap":988393216,"peers":["ACGC"]},"EFID":{"symbol":"EFID","name":"Edita Food Industries","sector":"ConsumerGoods","industry":"FoodBeverages","shariah":true,"vol20d":0.34,"momentum":0.598,"pb":7.112,"pe":13.445,"mcap":40712208384,"peers":["ADPC"]},"EGBE":{"symbol":"EGBE","name":"Egyptian Gulf Bank","sector":"Finance","industry":"FinancialServices","shariah":false,"vol20d":0.457,"momentum":0.672,"pb":0.012,"pe":2.285,"mcap":151501504,"peers":["ADIB"],"indices":["EGX30"]},"VALU":{"symbol":"VALU","name":"U Consumer Finance S.A.E","sector":"Finance","industry":"FinancialServices","shariah":false,"peers":["ACAMD"],"indices":["EGX30"]},"ARAB":{"symbol":"ARAB","name":"Arab Developers Holding","sector":"Finance","industry":"FinancialServices","shariah":false,"pb":2.153,"mcap":6861533696,"peers":["ADRI"]},"BIDI":{"symbol":"BIDI","name":"El Badr Investment and Development","sector":"BasicMaterials","industry":"Chemicals","shariah":true,"peers":["ADRI"]},"CCRS":{"symbol":"CCRS","name":"Gulf Canadian Real Estate Investment","sector":"Finance","industry":"FinancialServices","shariah":false,"vol20d":0.706,"momentum":0.082,"pb":50.542,"mcap":5285700096,"peers":["ADRI"]},"COPR":{"symbol":"COPR","name":"Cooper for Commercial Investment & Real Estate","sector":"Finance","industry":"FinancialServices","shariah":false,"pb":0.035,"mcap":788321152,"peers":["ADRI"]},"CRST":{"symbol":"CRST","name":"Creast Mark For Contracting And Real Estate","sector":"Construction","industry":"Construction","shariah":true,"peers":["ADRI"]},"DCRC":{"symbol":"DCRC","name":"Delta Construction & Rebuilding","sector":"Finance","industry":"FinancialServices","shariah":false,"peers":["ADRI"]},"EGREF":{"symbol":"EGREF","name":"Egyptians Real Estate Fund","sector":"Finance","industry":"HoldingCompanies","shariah":false,"mcap":240889776,"peers":["ADRI"]},"NBKE":{"symbol":"NBKE","name":"National Bank of Kuwait - Egypt","sector":"Finance","industry":"FinancialServices","shariah":false,"peers":["ADIB"],"indices":["EGX30"]},"CNFN":{"symbol":"CNFN","name":"Contact Financial Holding","sector":"Finance","industry":"FinancialServices","shariah":false,"pb":1.177,"pe":13.967,"mcap":5015321088,"peers":["ACAMD"],"indices":["EGX30"]},"NARE":{"symbol":"NARE","name":"Naeem Real Estate Holding Group","sector":"Finance","industry":"FinancialServices","shariah":false,"peers":["ADRI"]},"TANM":{"symbol":"TANM","name":"Tanmiya For Real Estate Investment","sector":"ITServices","industry":"ITServices","shariah":true,"peers":["ADRI"]},"ACAP":{"symbol":"ACAP","name":"A Capital Holding","sector":"Finance","industry":"FinancialServices","shariah":false,"peers":["AIH"],"indices":["EGX30"]},"BONY":{"symbol":"BONY","name":"Bonyan for Development and Trade","sector":"Finance","industry":"FinancialServices","shariah":false,"peers":["ADRI"],"indices":["EGX30"]},"MBSC":{"symbol":"MBSC","name":"Misr Beni Suef Cement","sector":"BasicMaterials","industry":"Steel","shariah":true,"vol20d":0.388,"momentum":0.834,"pb":0.472,"pe":8.243,"mcap":2254264832,"peers":["ALEX"],"indices":["EGX30"]},"PRDC":{"symbol":"PRDC","name":"Pioneers Properties For Urban Development","sector":"Finance","industry":"FinancialServices","shariah":false,"pb":0.445,"mcap":3256636928,"peers":["ADRI"],"indices":["EGX30"]},"SCEM":{"symbol":"SCEM","name":"Sinai Cement Co.","sector":"BasicMaterials","industry":"Steel","shariah":true,"vol20d":0.49,"momentum":0.307,"pb":0.44,"pe":0.439,"mcap":2644638720,"peers":["ALEX"],"indices":["EGX30"]},"ASPI":{"symbol":"ASPI","name":"Aspire Capital Holding","sector":"Finance","industry":"FinancialServices","shariah":false,"pb":1.098,"pe":0.504,"mcap":696000000,"peers":["ACAMD"]},"MASR":{"symbol":"MASR","name":"Madinet Masr for Housing & Development","sector":"Finance","industry":"FinancialServices","shariah":false,"pb":0.729,"pe":2.911,"mcap":9073750016,"peers":["ADRI"],"indices":["EGX30"]},"ORAS":{"symbol":"ORAS","name":"Orascom Construction Plc","sector":"Construction","industry":"Construction","shariah":true,"vol20d":0.0,"momentum":0.0,"pb":8.81,"pe":5.194,"mcap":7832832000,"peers":["ADRI"],"indices":["EGX30"]},"OCDI":{"symbol":"OCDI","name":"Six of October Development & Investment (SODIC)","sector":"Finance","industry":"FinancialServices","shariah":false,"vol20d":0.369,"momentum":0.114,"pb":3.542,"pe":14.699,"mcap":56097161216,"peers":["ADRI"],"indices":["EGX30"]},"OLFI":{"symbol":"OLFI","name":"Obour Land for Food Industries","sector":"ConsumerGoods","industry":"FoodBeverages","shariah":true,"vol20d":0.37,"momentum":0.087,"pb":2.572,"pe":5.532,"mcap":4159999744,"peers":["ADPC"],"indices":["EGX30"]},"BIGP":{"symbol":"BIGP","name":"ElBarbary Investment Group","sector":"ConsumerGoods","industry":"ConsumerGoods","shariah":true,"vol20d":0.467,"momentum":0.105},"EAST":{"symbol":"EAST","name":"Eastern Company","sector":"ConsumerGoods","industry":"FoodBeverages","shariah":true,"vol20d":0.32,"momentum":0.012,"pb":3.468,"pe":7.291,"mcap":65399996416,"peers":["ACAP"],"indices":["EGX30"]},"CANA":{"symbol":"CANA","name":"Suez Canal Bank","sector":"Finance","industry":"FinancialServices","shariah":false,"vol20d":0.411,"momentum":0.737,"pb":0.742,"pe":2.227,"mcap":15029999616,"peers":["ADIB"]},"JUFO":{"symbol":"JUFO","name":"Juhayna Food Industries","sector":"ConsumerGoods","industry":"FoodBeverages","shariah":true,"vol20d":0.425,"momentum":0.116,"pb":2.741,"pe":11.479,"mcap":22017110016,"peers":["ADPC"]},"MOIL":{"symbol":"MOIL","name":"Maridive and Oil Services","sector":"Construction","industry":"Construction","shariah":true,"vol20d":0.314,"momentum":0.215,"pb":0.79,"pe":4.222,"mcap":178697184,"peers":["EGAS"],"indices":["EGX30"]},"ROTO":{"symbol":"ROTO","name":"Rowad Tourism Company","sector":"ConsumerServices","industry":"Tourism","shariah":true,"vol20d":0.378,"momentum":0.211,"pb":6.511,"mcap":784570752,"peers":["EGTS"]},"DAPH":{"symbol":"DAPH","name":"Development & Engineering Consultants","sector":"Finance","industry":"FinancialServices","shariah":false,"vol20d":0.497,"momentum":0.286,"pb":1.896,"mcap":1367592320},"INFI":{"symbol":"INFI","name":"Ismailia National Co. for Food Industries","sector":"BasicMaterials","industry":"Chemicals","shariah":true,"vol20d":0.564,"momentum":0.331,"pb":4.132,"mcap":1075758464,"peers":["ADPC"]},"IDRE":{"symbol":"IDRE","name":"Ismailia Development and Real Estate","sector":"Finance","industry":"FinancialServices","shariah":false,"vol20d":0.323,"momentum":-0.006,"pb":4.523,"mcap":693664192,"peers":["ADRI"]},"ABUK":{"symbol":"ABUK","name":"Abou Kir Fertilizers & Chemical Industries","sector":"BasicMaterials","industry":"Chemicals","shariah":true,"vol20d":0.395,"momentum":0.398,"pb":2.29,"pe":8.917,"mcap":73592594432,"peers":["EGCH"],"indices":["EGX30"]},"COMI":{"symbol":"COMI","name":"Commercial International Bank - Egypt (CIB)","sector":"Finance","industry":"FinancialServices","shariah":false,"vol20d":0.324,"momentum":0.373,"pb":1.269,"pe":4.415,"mcap":267901370368,"peers":["ADIB"],"indices":["EGX30"]},"WKOL":{"symbol":"WKOL","name":"Wadi Kom Ombo For Land Reclamation","sector":"Finance","industry":"FinancialServices","shariah":false,"vol20d":0.357,"momentum":0.194,"pb":2.36,"mcap":641200000,"peers":["AALR"]},"ADRI":{"symbol":"ADRI","name":"Arab Development & Real Estate Investment","sector":"Finance","industry":"FinancialServices","shariah":false,"vol20d":0.561,"momentum":0.138,"peers":["AFDI"]},"ETEL":{"symbol":"ETEL","name":"Telecom Egypt","sector":"Telecom","industry":"Telecom","shariah":true,"vol20d":0.534,"momentum":0.718,"pb":0.879,"pe":2.939,"mcap":55940739072,"peers":["AMPI"],"indices":["EGX30"]},"SPIN":{"symbol":"SPIN","name":"Alexandria Spinning & Weaving","sector":"BasicMaterials","industry":"Chemicals","shariah":true,"vol20d":0.648,"momentum":0.461,"pb":2.66,"mcap":1991179392,"peers":["ACGC"],"indices":["EGX30"]},"CLHO":{"symbol":"CLHO","name":"Cleopatra Hospital Company","sector":"HealthCare","industry":"Hospitals","shariah":true,"vol20d":0.263,"momentum":0.116,"pb":2.645,"pe":14.37,"mcap":9580865536,"peers":["ADCI"],"indices":["EGX30"]},"MOED":{"symbol":"MOED","name":"The Egyptian Modern Education Systems","sector":"ConsumerServices","industry":"Tourism","shariah":true,"vol20d":0.313,"momentum":0.84,"pb":2.504,"mcap":299490016,"peers":["CAED"]},"ADIB":{"symbol":"ADIB","name":"Abu Dhabi Islamic Bank-Egypt","sector":"Finance","industry":"FinancialServices","shariah":true,"vol20d":0.429,"momentum":0.889,"pb":1.236,"pe":3.737,"mcap":56834998272,"peers":["CANA"],"indices":["EGX30"]},"AFMC":{"symbol":"AFMC","name":"Alexandria Flour Mills Co.","sector":"ConsumerGoods","industry":"ConsumerGoods","shariah":true,"vol20d":0.235,"momentum":0.068,"pb":2.654,"mcap":710791360,"peers":["ADPC"]},"DOMT":{"symbol":"DOMT","name":"Arabian Food Industries Co.","sector":"ConsumerGoods","industry":"FoodBeverages","shariah":true,"vol20d":0.198,"momentum":0.205,"pb":2.127,"pe":24.174,"mcap":3142608640,"peers":["ADPC"],"indices":["EGX30"]},"IFAP":{"symbol":"IFAP","name":"International Company for Agricultural Crops","sector":"BasicMaterials","industry":"Chemicals","shariah":true,"vol20d":0.228,"momentum":-0.038,"pb":1.526,"mcap":6564206080,"indices":["EGX30"]},"AMER":{"symbol":"AMER","name":"Amer Group Holding","sector":"Finance","industry":"FinancialServices","shariah":false,"vol20d":0.403,"momentum":0.824,"peers":["ACAP"]},"RAKT":{"symbol":"RAKT","name":"Rakta Paper Manufacturing Company","sector":"BasicMaterials","industry":"Chemicals","shariah":true,"vol20d":0.3,"momentum":-0.098,"pb":-1.083,"mcap":709200000,"peers":["DTPP"]},"ALCN":{"symbol":"ALCN","name":"Alexandria Containers & Goods","sector":"Shipping","industry":"Shipping","shariah":true,"vol20d":0.41,"momentum":0.161,"pb":16.061,"pe":24.813,"mcap":138249109504,"peers":["CSAG"],"indices":["EGX30"]},"ARCC":{"symbol":"ARCC","name":"Arabian Cement Company","sector":"BasicMaterials","industry":"Steel","shariah":true,"vol20d":0.285,"momentum":0.295,"pb":0.848,"pe":1.106,"mcap":3936108288,"peers":["ALEX"],"indices":["EGX30"]},"EHDR":{"symbol":"EHDR","name":"Egyptians Housing Development & Reconstruction","sector":"Finance","industry":"FinancialServices","shariah":false,"vol20d":0.319,"momentum":5.106,"pb":0.384,"mcap":272160000,"peers":["ADRI"]},"ENGC":{"symbol":"ENGC","name":"Industrial Engineering Co. for Construction","sector":"Construction","industry":"Construction","shariah":true,"vol20d":0.553,"momentum":0.193,"pb":1.033,"pe":4.116,"mcap":3000210176},"AREH":{"symbol":"AREH","name":"Egyptian Real Estate Group","sector":"Construction","industry":"Construction","shariah":true,"vol20d":0.334,"momentum":0.185,"pb":2.633,"mcap":309600000,"peers":["ADRI"]},"BIOC":{"symbol":"BIOC","name":"GlaxoSmithKline S.A.E.","sector":"ConsumerGoods","industry":"ConsumerGoods","shariah":true,"vol20d":0.372,"momentum":0.105,"pb":1.073,"pe":0.893,"mcap":153195839488,"indices":["EGX30"]},"ELWA":{"symbol":"ELWA","name":"Elwadi for International Investment","sector":"ConsumerServices","industry":"Tourism","shariah":true,"vol20d":0.334,"momentum":-0.026,"pb":0.34,"mcap":109382000,"peers":["ACAP"]},"EFIC":{"symbol":"EFIC","name":"Egyptian Financial & Industrial Co.","sector":"BasicMaterials","industry":"Chemicals","shariah":true,"vol20d":0.117,"momentum":0.182,"pb":3.434,"pe":13.685,"mcap":10414000128,"peers":["ACAP"],"indices":["EGX30"]},"KZPC":{"symbol":"KZPC","name":"Kafr El Zayat For Pesticides & Chemicals","sector":"BasicMaterials","industry":"Chemicals","shariah":true,"vol20d":0.262,"momentum":-0.063,"pb":2.481,"mcap":1680625920,"peers":["ABUK"]},"ODIN":{"symbol":"ODIN","name":"ODIN Investments","sector":"Finance","industry":"FinancialServices","shariah":false,"vol20d":0.392,"momentum":0.134,"pb":2.331,"mcap":994199936,"peers":["ACAMD"]},"ORWE":{"symbol":"ORWE","name":"Oriental Weavers Carpet","sector":"ConsumerGoods","industry":"ConsumerGoods","shariah":true,"vol20d":0.228,"momentum":0.084,"pb":0.882,"pe":8.281,"mcap":16634333184,"peers":["ACGC"],"indices":["EGX30"]},"RAYA":{"symbol":"RAYA","name":"Raya Holding for Financial Investments","sector":"ITServices","industry":"ITServices","shariah":true,"vol20d":0.496,"momentum":0.754,"pb":1.518,"pe":3.41,"mcap":8899357696,"peers":["AMPI"]},"EGTS":{"symbol":"EGTS","name":"Egyptian for Tourism Resorts","sector":"Electricity","industry":"Electricity","shariah":true,"vol20d":0.298,"momentum":-0.164,"pb":8.976,"pe":6.237,"mcap":6352500224,"peers":["EITP"],"indices":["EGX30"]},"PHAR":{"symbol":"PHAR","name":"Egyptian International Pharmaceutical Industries","sector":"HealthCare","industry":"Pharmaceuticals","shariah":true,"vol20d":0.284,"momentum":0.257,"pb":1.081,"pe":5.168,"mcap":6750229504,"peers":["ADCI"],"indices":["EGX30"]},"SWDY":{"symbol":"SWDY","name":"El Sewedy Electric Company","sector":"Construction","industry":"Construction","shariah":true,"vol20d":0.317,"momentum":0.11,"pb":1.526,"pe":6.453,"mcap":102025871360,"peers":["EGAS"],"indices":["EGX30"]},"EXPA":{"symbol":"EXPA","name":"Export Development Bank of Egypt","sector":"Finance","industry":"FinancialServices","shariah":false,"vol20d":0.276,"momentum":0.137,"pb":1.126,"pe":3.664,"mcap":27607998464,"peers":["ADIB"],"indices":["EGX30"]},"SNFC":{"symbol":"SNFC","name":"Sharkia National Company for Food Security","sector":"BasicMaterials","industry":"Chemicals","shariah":true,"vol20d":0.246,"momentum":0.004,"pb":7.935,"mcap":440963968},"ADPC":{"symbol":"ADPC","name":"Arab Dairy Products Co.","sector":"ConsumerGoods","industry":"FoodBeverages","shariah":true,"vol20d":0.354,"momentum":0.216,"pb":1.245,"mcap":990000000,"peers":["AFMC"]},"MICH":{"symbol":"MICH","name":"Misr Chemical Industries","sector":"BasicMaterials","industry":"Chemicals","shariah":true,"vol20d":0.198,"momentum":-0.031,"pb":2.082,"pe":5.623,"mcap":3028472064,"peers":["ABUK"]},"DSCW":{"symbol":"DSCW","name":"Dice Sports & Casual Wear Manufacturers","sector":"ConsumerGoods","industry":"FoodBeverages","shariah":true,"vol20d":0.243,"momentum":-0.31,"pb":2.419,"mcap":3714434560},"ARVA":{"symbol":"ARVA","name":"Arab Valves Co.","sector":"Construction","industry":"Construction","shariah":true,"vol20d":0.374,"momentum":-0.006,"pb":1.096,"mcap":127927336},"CSAG":{"symbol":"CSAG","name":"Canal Shipping Agencies Co.","sector":"Shipping","industry":"Shipping","shariah":true,"vol20d":0.437,"momentum":0.294,"pb":3.337,"pe":7.744,"mcap":5714999808,"peers":["ALCN"],"indices":["EGX30"]},"EGAL":{"symbol":"EGAL","name":"Egypt Aluminum","sector":"BasicMaterials","industry":"Steel","shariah":true,"vol20d":0.545,"momentum":0.696,"pb":1.776,"pe":5.084,"mcap":42508128256,"peers":["ALUM"],"indices":["EGX30"]},"CERA":{"symbol":"CERA","name":"Arab Ceramic Co. - Ceramica Remas","sector":"Construction","industry":"Construction","shariah":true,"vol20d":0.414,"momentum":-0.343,"pb":1.756,"mcap":831234432,"peers":["ALEX"]},"CIEB":{"symbol":"CIEB","name":"Credit Agricole Egypt","sector":"Finance","industry":"FinancialServices","shariah":false,"vol20d":0.421,"momentum":0.383,"pb":1.241,"pe":4.139,"mcap":25350000640,"peers":["ADIB"],"indices":["EGX30"]},"LCSW":{"symbol":"LCSW","name":"Lecico Egypt (S.A.E.)","sector":"Construction","industry":"Construction","shariah":true,"vol20d":0.331,"momentum":0.016,"pb":0.24,"pe":7.97,"mcap":1944800000,"peers":["ALEX"]},"HDBK":{"symbol":"HDBK","name":"Housing & Development Bank","sector":"Finance","industry":"FinancialServices","shariah":false,"vol20d":0.232,"momentum":0.497,"pb":0.576,"pe":1.286,"mcap":24030699520,"peers":["ADIB"],"indices":["EGX30"]},"EGAS":{"symbol":"EGAS","name":"Egypt Gas Co.","sector":"Electricity","industry":"Electricity","shariah":true,"vol20d":0.287,"momentum":0.014,"pb":0.82,"pe":11.538,"mcap":3894003200,"peers":["MOIL"],"indices":["EGX30"]},"ACGC":{"symbol":"ACGC","name":"Arab Cotton Ginning Co.","sector":"BasicMaterials","industry":"Chemicals","shariah":true,"vol20d":0.257,"momentum":0.086,"pb":0.686,"pe":3.477,"mcap":1602136192,"peers":["APSW"]},"BTFH":{"symbol":"BTFH","name":"Beltone Holding","sector":"Finance","industry":"FinancialServices","shariah":false,"vol20d":0.341,"momentum":0.032,"pb":1.442,"pe":20.867,"mcap":33547675648,"peers":["ACAMD"]},"KABO":{"symbol":"KABO","name":"El-Nasr Clothing & Textiles Co.","sector":"BasicMaterials","industry":"Chemicals","shariah":true,"vol20d":0.433,"momentum":0.304,"pb":2.221,"mcap":1360912128,"peers":["ACGC"]},"FWRY":{"symbol":"FWRY","name":"Fawry For Banking Technology And Electronic Payment","sector":"ITServices","industry":"ITServices","shariah":true,"vol20d":0.421,"momentum":0.338,"pb":3.006,"pe":8.744,"mcap":23232487424,"peers":["ADIB"],"indices":["EGX30"]},"MEPA":{"symbol":"MEPA","name":"Medical Packaging Company","sector":"Construction","industry":"Construction","shariah":true,"vol20d":0.527,"momentum":0.341,"pb":3.768,"mcap":513484160,"peers":["ADCI"]},"RTVC":{"symbol":"RTVC","name":"Remco Tourism Villages Construction","sector":"ConsumerServices","industry":"Tourism","shariah":true,"vol20d":0.355,"momentum":0.011,"pb":0.208,"mcap":755201280,"peers":["EGTS"]},"FAIT":{"symbol":"FAIT","name":"Faisal Islamic Bank of Egypt","sector":"Finance","industry":"FinancialServices","shariah":true,"vol20d":0.15,"momentum":0.157,"pb":0.447,"pe":4.955,"mcap":19594598400,"peers":["ADIB"]},"EEII":{"symbol":"EEII","name":"El Arabia Engineering Industries","sector":"ITServices","industry":"ITServices","shariah":true,"vol20d":0.347,"momentum":0.052,"pb":2.302,"mcap":274533728,"peers":["ALUM"]},"AIH":{"symbol":"AIH","name":"Arabia Investments Holding","sector":"Finance","industry":"FinancialServices","shariah":false,"vol20d":0.547,"momentum":0.123,"pb":1.064,"pe":5.273,"mcap":903715392,"peers":["ACAP"]},"HRHO":{"symbol":"HRHO","name":"EFG Holding S.A.E.","sector":"Finance","industry":"FinancialServices","shariah":false,"vol20d":0.408,"momentum":0.1,"pb":0.874,"pe":7.615,"mcap":30943492096,"peers":["ACAMD"],"indices":["EGX30"]},"MTIE":{"symbol":"MTIE","name":"MM Group for Industry and International Trade","sector":"ConsumerGoods","industry":"ConsumerGoods","shariah":true,"vol20d":0.214,"momentum":0.167,"pb":3.391,"pe":16.204,"mcap":16500101120,"peers":["ACAP"],"indices":["EGX30"]},"TMGH":{"symbol":"TMGH","name":"Talaat Moustafa Group Holding","sector":"Finance","industry":"FinancialServices","shariah":false,"vol20d":0.322,"momentum":0.622,"pb":1.475,"pe":8.056,"mcap":119517921280,"peers":["ADRI"],"indices":["EGX30"]},"AMOC":{"symbol":"AMOC","name":"Alexandria Mineral Oils Co.","sector":"Energy","industry":"OilGas","shariah":true,"vol20d":0.156,"momentum":0.048,"pb":2.448,"pe":7.828,"mcap":11726820352,"indices":["EGX30"]},"AJWA":{"symbol":"AJWA","name":"Ajwa for Food Industries","sector":"ConsumerGoods","industry":"FoodBeverages","shariah":true,"vol20d":0.14,"momentum":-0.161,"pb":1.897,"mcap":1306998272,"peers":["ADPC"]},"ASCM":{"symbol":"ASCM","name":"ASEC Co. for Mining","sector":"BasicMaterials","industry":"Steel","shariah":true,"vol20d":0.385,"momentum":0.017,"pb":0.768,"pe":0.958,"mcap":1981214976,"peers":["ALUM"]},"ISPH":{"symbol":"ISPH","name":"Ibnsina Pharma Distribution","sector":"ConsumerGoods","industry":"ConsumerGoods","shariah":true,"vol20d":0.423,"momentum":0.096,"pb":1.09,"pe":3.671,"mcap":3034080000,"peers":["ADCI"],"indices":["EGX30"]},"OIH":{"symbol":"OIH","name":"Orascom Investment Holding","sector":"Telecom","industry":"Telecom","shariah":true,"vol20d":0.32,"momentum":0.139,"pb":1.056,"mcap":2266138368,"peers":["ACAP"],"indices":["EGX30"]},"MPRC":{"symbol":"MPRC","name":"Egyptian Media Production City","sector":"ConsumerServices","industry":"Tourism","shariah":true,"vol20d":0.337,"momentum":-0.227,"pb":0.882,"pe":5.632,"mcap":3630913536,"peers":["AMPI"],"indices":["EGX30"]},"ECAP":{"symbol":"ECAP","name":"El Ezz Ceramics & Porcelain","sector":"Construction","industry":"Construction","shariah":true,"vol20d":0.279,"momentum":0.015,"pb":2.078,"mcap":1223143808,"peers":["ALEX"]},"ELEC":{"symbol":"ELEC","name":"Electro Cable Egypt","sector":"Construction","industry":"Construction","shariah":true,"vol20d":0.496,"momentum":-0.139,"pb":2.554,"pe":147.5,"mcap":9774944256,"peers":["ALUM"],"indices":["EGX30"]},"ISMA":{"symbol":"ISMA","name":"Ismailia Misr Poultry Company","sector":"BasicMaterials","industry":"Chemicals","shariah":true,"vol20d":0.357,"momentum":0.082,"pb":4.203,"mcap":765577408,"peers":["ADPC"]},"SPMD":{"symbol":"SPMD","name":"Speed Medical Co","sector":"HealthCare","industry":"Hospitals","shariah":true,"vol20d":0.295,"momentum":0.127,"pb":3.539,"mcap":600601728,"peers":["ADCI"]},"ALUM":{"symbol":"ALUM","name":"Arab Aluminum Co. SAE","sector":"BasicMaterials","industry":"Steel","shariah":true,"vol20d":0.352,"momentum":0.215,"pb":4.883,"mcap":550649984,"peers":["ASCM"]},"HELI":{"symbol":"HELI","name":"Heliopolis Housing","sector":"ConsumerGoods","industry":"ConsumerGoods","shariah":true,"vol20d":0.31,"momentum":0.085,"pb":3.998,"pe":4.328,"mcap":41254133760,"peers":["ADRI"],"indices":["EGX30"]},"CICH":{"symbol":"CICH","name":"CI Capital Holding for Financial Investments","sector":"Finance","industry":"FinancialServices","shariah":false,"vol20d":0.391,"momentum":0.472,"pb":0.638,"pe":3.124,"mcap":5030000128,"peers":["ACAMD"],"indices":["EGX30"]},"ACAMD":{"symbol":"ACAMD","name":"Arab Co. for Asset Management & Development","sector":"Finance","industry":"FinancialServices","shariah":false,"vol20d":0.659,"momentum":1.342,"pb":8.636,"mcap":1006300288,"peers":["ACTF"]},"ZMID":{"symbol":"ZMID","name":"Zahraa El Maadi Investment and Development","sector":"Finance","industry":"FinancialServices","shariah":false,"vol20d":0.277,"momentum":0.224,"pb":3.196,"pe":12.583,"mcap":7550000128,"peers":["ADRI"],"indices":["EGX30"]},"MCQE":{"symbol":"MCQE","name":"Misr Cement (Qena) Company","sector":"BasicMaterials","industry":"Steel","shariah":true,"vol20d":0.311,"momentum":1.367,"pb":0.507,"pe":0.891,"mcap":1811520128,"peers":["ALEX"],"indices":["EGX30"]},"SUGR":{"symbol":"SUGR","name":"Delta Sugar Company","sector":"BasicMaterials","industry":"Chemicals","shariah":true,"vol20d":0.406,"momentum":-0.041,"pb":4.394,"pe":4.4,"mcap":9002560512,"peers":["ADPC"],"indices":["EGX30"]},"AMIA":{"symbol":"AMIA","name":"Arab Moltaqa Investments","sector":"Finance","industry":"FinancialServices","shariah":false,"vol20d":0.511,"momentum":0.54,"pb":0.897,"mcap":1174312320},"ATQA":{"symbol":"ATQA","name":"Misr National Steel","sector":"Construction","industry":"Construction","shariah":true,"vol20d":0.381,"momentum":-0.122,"pb":1.77,"pe":116.667,"mcap":4200000000,"peers":["ALUM"],"indices":["EGX30"]},"ELKA":{"symbol":"ELKA","name":"El Kahera Housing","sector":"Finance","industry":"FinancialServices","shariah":false,"vol20d":2.118,"momentum":-0.387,"pb":0.525,"mcap":3024669440,"peers":["ADRI"]},"SKPC":{"symbol":"SKPC","name":"Sidi Kerir Petrochemicals","sector":"BasicMaterials","industry":"Chemicals","shariah":true,"vol20d":0.32,"momentum":-0.198,"pb":4.427,"pe":48.732,"mcap":30946861056,"peers":["ABUK"],"indices":["EGX30"]},"EGCH":{"symbol":"EGCH","name":"Egyptian Chemical Industries","sector":"BasicMaterials","industry":"Chemicals","shariah":true,"vol20d":0.406,"momentum":0.073,"pb":0.974,"mcap":16111154176,"peers":["ABUK"],"indices":["EGX30"]},"POUL":{"symbol":"POUL","name":"Cairo Poultry Co.","sector":"BasicMaterials","industry":"Chemicals","shariah":true,"vol20d":0.274,"momentum":0.279,"pb":0.58,"pe":1.908,"mcap":4196054016,"peers":["ADPC"],"indices":["EGX30"]},"SAUD":{"symbol":"SAUD","name":"Al Baraka Bank Egypt","sector":"Finance","industry":"FinancialServices","shariah":true,"vol20d":0.36,"momentum":0.436,"pb":0.508,"pe":2.381,"mcap":7947631104,"peers":["ADIB"],"indices":["EGX30"]},"BINV":{"symbol":"BINV","name":"B Investments Holding","sector":"Finance","industry":"FinancialServices","shariah":false,"vol20d":0.491,"momentum":0.546,"pb":0.876,"pe":9.081,"mcap":5135892992,"peers":["ACAP"],"indices":["EGX30"]},"ELSH":{"symbol":"ELSH","name":"El-Shams Housing & Development","sector":"Finance","industry":"FinancialServices","shariah":false,"vol20d":0.311,"momentum":-0.047,"pb":1.332,"pe":8.649,"mcap":1510987520,"peers":["ADRI"]},"EMFD":{"symbol":"EMFD","name":"Emaar Misr for Development","sector":"Finance","industry":"FinancialServices","shariah":false,"vol20d":0.252,"momentum":0.174,"pb":0.585,"pe":3.787,"mcap":38782136320,"peers":["ADRI"],"indices":["EGX30"]},"PRMH":{"symbol":"PRMH","name":"Prime Holding","sector":"Finance","industry":"FinancialServices","shariah":false,"vol20d":0.882,"momentum":0.817,"pb":0.46,"mcap":215950000,"peers":["ACAMD"]},"RREI":{"symbol":"RREI","name":"Arab Real Estate Investment Co.","sector":"Finance","industry":"FinancialServices","shariah":false,"vol20d":0.418,"momentum":0.24,"pb":0.647,"mcap":273750400,"peers":["ADRI"]},"ATLC":{"symbol":"ATLC","name":"Al Tawfeek Leasing Company","sector":"Finance","industry":"FinancialServices","shariah":false,"vol20d":0.215,"momentum":0.066,"pb":1.373,"mcap":1536000000,"peers":["ACAMD"]},"GIHD":{"symbol":"GIHD","name":"Gharbia Islamic Housing Development","sector":"Finance","industry":"FinancialServices","shariah":false,"vol20d":0.39,"momentum":-0.097,"pb":2.777,"mcap":129487504,"peers":["ADRI"]},"UNIT":{"symbol":"UNIT","name":"United Co. for Housing & Development","sector":"Finance","industry":"FinancialServices","shariah":false,"vol20d":0.891,"momentum":-0.108,"pb":1.488,"mcap":1450209408,"peers":["ADRI"]},"SVCE":{"symbol":"SVCE","name":"South Valley Cement Company","sector":"BasicMaterials","industry":"Steel","shariah":true,"vol20d":0.427,"momentum":0.308,"pb":0.333,"mcap":1224328192,"peers":["ALEX"],"indices":["EGX30"]},"ORHD":{"symbol":"ORHD","name":"Orascom Development Egypt","sector":"ConsumerGoods","industry":"ConsumerGoods","shariah":true,"vol20d":0.231,"momentum":0.139,"pb":0.933,"pe":2.935,"mcap":15363134464,"peers":["ADRI"]},"PHDC":{"symbol":"PHDC","name":"Palm Hills Development Co.","sector":"Finance","industry":"FinancialServices","shariah":false,"vol20d":0.375,"momentum":0.215,"pb":0.771,"pe":3.233,"mcap":13442466816,"peers":["ADRI"],"indices":["EGX30"]},"AFDI":{"symbol":"AFDI","name":"Alahly For Development & Investment","sector":"Finance","industry":"FinancialServices","shariah":false,"vol20d":0.3,"momentum":-0.096,"pb":1.905,"pe":16.652,"mcap":560520000,"peers":["ADRI"]},"UEGC":{"symbol":"UEGC","name":"El-Saeed Company for Contracting","sector":"Finance","industry":"FinancialServices","shariah":false,"vol20d":0.52,"momentum":0.24,"pb":0.422,"pe":5.047,"mcap":549000384,"peers":["ADRI"]},"CCAP":{"symbol":"CCAP","name":"QALA For Financial Investments","sector":"Finance","industry":"FinancialServices","shariah":false,"vol20d":0.36,"momentum":0.427,"pb":-1.806,"mcap":9298221056,"peers":["ACAMD"],"indices":["EGX30"]}};

const ALL_SYMBOLS = Object.keys(EGX_DATA);
const ALL_SECTORS = [...new Set(Object.values(EGX_DATA).map(s => s.sector))].sort();

const VOL_THRESHOLDS = { conservative: 0.25, moderate: 0.45, aggressive: 1.5 };
const HORIZON_MOMENTUM_BOOST = { short: 1.5, medium: 1.0, long: 0.5 };

// ── XAI: Detailed scoring weights ──
const SCORE_WEIGHTS = {
  sameSector: 0.40,
  peerLink: 0.50,
  momentum: 1.00,   // multiplied by horizon boost
  valuation: 0.30,  // P/B between 0 and 3
  lowVol: 0.20,     // vol < 50% of threshold
};

function sparqlEngine(queryParams) {
  const { inputSymbol, riskLevel, investmentPeriod, shariahOnly, maxResults } = queryParams;
  const inputStock = EGX_DATA[inputSymbol];
  if (!inputStock) return { results: [], query: "", explanation: "", inferencePath: null };

  const maxVol = VOL_THRESHOLDS[riskLevel];
  const momentumBoost = HORIZON_MOMENTUM_BOOST[investmentPeriod];

  // Build SPARQL query string
  const queryLines = [
    `PREFIX egx: <http://egx.ontology/stocks#>`,
    `PREFIX egx-sector: <http://egx.ontology/sectors#>`,
    ``,
    `SELECT ?stock ?name ?sector ?industry ?vol20d ?momentum ?pb ?shariah ?score`,
    `WHERE {`,
    `  ?stock a egx:Stock ;`,
    `         egx:hasSymbol ?sym ;`,
    `         egx:hasCompanyName ?name ;`,
    `         egx:belongsToSector ?sector ;`,
    `         egx:isShariahCompliant ?shariah .`,
    ``,
    `  # Exclude the input stock itself`,
    `  FILTER(?sym != "${inputSymbol}")`,
    ``,
    `  # Risk filter: volatility must not exceed threshold`,
    `  OPTIONAL { ?stock egx:hasVolatility20D ?vol20d }`,
    `  FILTER(!BOUND(?vol20d) || ?vol20d <= ${maxVol.toFixed(2)})`,
    shariahOnly ? `  # Shariah filter` : `  # No Shariah filter applied`,
    shariahOnly ? `  FILTER(?shariah = true)` : `  # (investor accepts all stocks)`,
    ``,
    `  # Peer relationship: same sector OR industry peer link`,
    `  OPTIONAL { ?stock egx:belongsToSector egx-sector:${inputStock.sector} }`,
    `  OPTIONAL { ?stock egx:industryPeer egx:${inputSymbol} }`,
    ``,
    `  # Momentum signals for investment horizon`,
    `  OPTIONAL { ?stock egx:hasMomentum90D ?momentum }`,
    ``,
    `  # Valuation`,
    `  OPTIONAL { ?stock egx:hasPBRatio ?pb }`,
    ``,
    `  BIND(`,
    `    (IF(BOUND(?momentum), ?momentum * ${momentumBoost.toFixed(1)}, 0.0))`,
    `    + (IF(BOUND(?pb) && ?pb > 0 && ?pb < 3, 0.3, 0.0))`,
    `    + (IF(BOUND(?vol20d) && ?vol20d < ${(maxVol * 0.5).toFixed(2)}, 0.2, 0.0))`,
    `    AS ?score`,
    `  )`,
    `}`,
    `ORDER BY DESC(?score)`,
    `LIMIT ${maxResults || 10}`,
  ];

  const query = queryLines.join("\n");

  // ── XAI: Build inference path nodes ──
  const inferencePath = {
    root: `Seed: ${inputSymbol} (${inputStock.name})`,
    steps: [],
    filters: [],
    scoring: [],
  };

  inferencePath.steps.push({
    id: "step-1",
    label: "Ontology Lookup",
    detail: `Resolved ${inputSymbol} → sector=${inputStock.sector}, peers=[${(inputStock.peers || []).join(", ")}]`,
    status: "ok",
  });

  // Step 2: Universe filtering
  let universeSize = ALL_SYMBOLS.length - 1;
  let filtered = ALL_SYMBOLS.filter(sym => sym !== inputSymbol);
  
  inferencePath.steps.push({
    id: "step-2",
    label: "Universe Definition",
    detail: `Started with ${universeSize} candidate stocks (excluded input)`,
    status: "ok",
  });

  // Apply filters and track
  const preShariah = filtered.length;
  if (shariahOnly) {
    filtered = filtered.filter(sym => EGX_DATA[sym].shariah);
    inferencePath.filters.push({
      name: "Shariah Filter",
      before: preShariah,
      after: filtered.length,
      active: true,
      condition: "shariah === true",
    });
  } else {
    inferencePath.filters.push({
      name: "Shariah Filter",
      before: preShariah,
      after: preShariah,
      active: false,
      condition: "shariah === true",
    });
  }

  const preVol = filtered.length;
  filtered = filtered.filter(sym => {
    const v = EGX_DATA[sym].vol20d;
    return v === undefined || v <= maxVol;
  });
  inferencePath.filters.push({
    name: "Volatility Filter",
    before: preVol,
    after: filtered.length,
    active: true,
    condition: `vol20d ≤ ${maxVol} (${riskLevel})`,
  });

  inferencePath.steps.push({
    id: "step-3",
    label: "Hard Filters Applied",
    detail: `${filtered.length} stocks remain after Shariah + Volatility filters`,
    status: filtered.length > 0 ? "ok" : "warn",
  });

  // ── XAI: Scoring with full breakdown ──
  const candidates = filtered.map(sym => {
    const s = EGX_DATA[sym];
    
    const sameSector = s.sector === inputStock.sector ? SCORE_WEIGHTS.sameSector : 0.0;
    const isPeer = (inputStock.peers || []).includes(s.symbol) ? SCORE_WEIGHTS.peerLink : 0.0;
    const momentumRaw = s.momentum !== undefined ? s.momentum : 0.0;
    const momentumScore = momentumRaw * momentumBoost;
    const valuationBonus = (s.pb !== undefined && s.pb > 0 && s.pb < 3) ? SCORE_WEIGHTS.valuation : 0.0;
    const lowVolBonus = (s.vol20d !== undefined && s.vol20d < maxVol * 0.5) ? SCORE_WEIGHTS.lowVol : 0.0;
    const score = sameSector + isPeer + momentumScore + valuationBonus + lowVolBonus;

    const reasons = [];
    if (sameSector > 0) reasons.push(`Same sector (${s.sector})`);
    if (isPeer > 0) reasons.push("Direct ontology peer");
    if (s.shariah) reasons.push("Shariah compliant");
    if (s.indices && s.indices.length > 0) reasons.push(`In ${s.indices[0]}`);
    if (s.momentum !== undefined && s.momentum > 0.2) reasons.push("Strong 90D momentum");
    if (s.pb !== undefined && s.pb > 0 && s.pb < 1) reasons.push("Undervalued (P/B < 1)");

    return {
      ...s,
      score,
      reasons,
      sameSector: sameSector > 0,
      // XAI breakdown
      scoreBreakdown: {
        sameSector: { value: sameSector, weight: SCORE_WEIGHTS.sameSector, raw: s.sector === inputStock.sector ? 1 : 0 },
        peerLink: { value: isPeer, weight: SCORE_WEIGHTS.peerLink, raw: isPeer > 0 ? 1 : 0 },
        momentum: { value: momentumScore, weight: momentumBoost, raw: momentumRaw },
        valuation: { value: valuationBonus, weight: SCORE_WEIGHTS.valuation, raw: s.pb },
        lowVol: { value: lowVolBonus, weight: SCORE_WEIGHTS.lowVol, raw: s.vol20d },
      },
    };
  }).sort((a, b) => b.score - a.score).slice(0, maxResults || 10);

  inferencePath.scoring = [
    { name: "Sector Match", weight: SCORE_WEIGHTS.sameSector, desc: "Same sector as seed stock" },
    { name: "Peer Link", weight: SCORE_WEIGHTS.peerLink, desc: "Listed in seed stock peers[]" },
    { name: "Momentum", weight: `1.0 × ${momentumBoost}`, desc: `90D momentum × ${investmentPeriod} horizon boost` },
    { name: "Valuation", weight: SCORE_WEIGHTS.valuation, desc: "P/B between 0 and 3" },
    { name: "Low Volatility", weight: SCORE_WEIGHTS.lowVol, desc: `Vol < ${(maxVol * 0.5).toFixed(2)} (50% of threshold)` },
  ];

  inferencePath.steps.push({
    id: "step-4",
    label: "Composite Scoring",
    detail: `Scored ${filtered.length} stocks using 5 weighted features; returned top ${candidates.length}`,
    status: "ok",
  });

  const explanation = `Queried ${ALL_SYMBOLS.length} stocks from EGX ontology. Filters: vol ≤ ${maxVol} (${riskLevel}), horizon=${investmentPeriod} (momentum boost ×${momentumBoost})${shariahOnly ? ", Shariah=true" : ""}. Ranked by composite SPARQL BIND score.`;

  return { results: candidates, query, explanation, inferencePath };
}

const SECTOR_COLORS = {
  Finance:"#3A7BD5", BasicMaterials:"#E67E22", ConsumerGoods:"#27AE60",
  Construction:"#8E44AD", HealthCare:"#E74C3C", ConsumerServices:"#16A085",
  Energy:"#F39C12", ITServices:"#2980B9", Telecom:"#1ABC9C", Shipping:"#34495E",
  Electricity:"#F1C40F",
};

const SCORE_COLORS = {
  sameSector: "#3A7BD5",
  peerLink: "#8E44AD",
  momentum: "#27AE60",
  valuation: "#E67E22",
  lowVol: "#1ABC9C",
};

// ── XAI Components ──

function ScoreBadge({ score }) {
  const pct = Math.min(100, Math.max(0, score * 40));
  const color = score > 1.5 ? "#27AE60" : score > 0.8 ? "#E67E22" : "#3A7BD5";
  return (
    <div style={{display:"flex",alignItems:"center",gap:6}}>
      <div style={{width:56,height:6,background:"#e5e7eb",borderRadius:3,overflow:"hidden"}}>
        <div style={{width:`${pct}%`,height:"100%",background:color,borderRadius:3,transition:"width 0.4s"}}/>
      </div>
      <span style={{fontSize:12,fontWeight:500,color,minWidth:28}}>{score.toFixed(2)}</span>
    </div>
  );
}

function StockBadge({ symbol, name, sector }) {
  const color = SECTOR_COLORS[sector] || "#888";
  return (
    <div style={{display:"inline-flex",alignItems:"center",gap:6,background:"var(--color-background-secondary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:"var(--border-radius-md)",padding:"4px 10px",fontSize:13}}>
      <span style={{width:8,height:8,borderRadius:"50%",background:color,flexShrink:0}}/>
      <strong style={{fontSize:13,color:"var(--color-text-primary)"}}>{symbol}</strong>
      <span style={{color:"var(--color-text-secondary)",fontSize:12,maxWidth:180,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{name}</span>
    </div>
  );
}

/** XAI: Per-stock score decomposition bars */
function XAIScoreBreakdown({ breakdown, totalScore }) {
  const entries = Object.entries(breakdown).filter(([,v]) => v.value > 0);
  if (entries.length === 0) return null;
  
  const maxVal = Math.max(...entries.map(([,v]) => v.value), 0.5);

  return (
    <div style={{marginTop:8,padding:"8px 10px",background:"var(--color-background-secondary)",borderRadius:"var(--border-radius-md)",border:"0.5px solid var(--color-border-tertiary)"}}>
      <div style={{fontSize:11,fontWeight:600,color:"var(--color-text-secondary)",marginBottom:6,display:"flex",justifyContent:"space-between"}}>
        <span>Score Decomposition</span>
        <span style={{color:"var(--color-text-tertiary)"}}>Total: {totalScore.toFixed(2)}</span>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:5}}>
        {entries.map(([key, data]) => (
          <div key={key} style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:10,color:"var(--color-text-secondary)",width:90,textAlign:"right",flexShrink:0}}>
              {key === "sameSector" ? "Sector Match" : key === "peerLink" ? "Peer Link" : key === "lowVol" ? "Low Vol" : key[0].toUpperCase() + key.slice(1)}
            </span>
            <div style={{flex:1,height:14,background:"var(--color-background-primary)",borderRadius:3,overflow:"hidden",position:"relative"}}>
              <div style={{
                width: `${Math.min(100, (data.value / maxVal) * 100)}%`,
                height: "100%",
                background: SCORE_COLORS[key],
                borderRadius: 3,
                transition: "width 0.5s ease",
                opacity: 0.85,
              }}/>
            </div>
            <span style={{fontSize:10,fontWeight:500,color:SCORE_COLORS[key],minWidth:32,textAlign:"right"}}>
              +{data.value.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** XAI: Inference Path / Decision Flow Visualization */
function InferencePathView({ path, inputSymbol, riskLevel, investmentPeriod, shariahOnly }) {
  if (!path) return null;

  const nodeBase = {
    padding: "10px 14px",
    borderRadius: "var(--border-radius-md)",
    fontSize: 12,
    position: "relative",
    border: "0.5px solid var(--color-border-tertiary)",
  };

  const connector = {
    width: 2,
    height: 16,
    background: "var(--color-border-secondary)",
    marginLeft: 20,
  };

  return (
    <div style={{marginBottom:"1.5rem",background:"var(--color-background-secondary)",borderRadius:"var(--border-radius-lg)",padding:"16px",border:"0.5px solid var(--color-border-tertiary)"}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
        <span style={{fontSize:16}}>🧠</span>
        <h3 style={{margin:0,fontSize:14,fontWeight:600,color:"var(--color-text-primary)"}}>XAI Inference Path</h3>
        <span style={{fontSize:11,color:"var(--color-text-tertiary)",marginLeft:"auto"}}>Transparent decision trace</span>
      </div>

      {/* Seed node */}
      <div style={{...nodeBase, background:"var(--color-background-info)", borderColor:"var(--color-border-info)"}}>
        <div style={{fontWeight:600,color:"var(--color-text-info)",fontSize:13}}>🌱 Seed Stock: {path.root}</div>
        <div style={{fontSize:11,color:"var(--color-text-secondary)",marginTop:4}}>
          Risk={riskLevel} · Horizon={investmentPeriod} · Shariah={shariahOnly ? "Only" : "Any"}
        </div>
      </div>
      <div style={connector}/>

      {/* Steps */}
      {path.steps.map((step, idx) => (
        <div key={step.id}>
          <div style={{...nodeBase, background:"var(--color-background-primary)"}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{
                width:20,height:20,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:10,fontWeight:700,
                background: step.status === "ok" ? "#27AE6022" : "#E74C3C22",
                color: step.status === "ok" ? "#27AE60" : "#E74C3C",
              }}>
                {idx + 1}
              </span>
              <span style={{fontWeight:600,color:"var(--color-text-primary)"}}>{step.label}</span>
              {step.status === "warn" && <span style={{marginLeft:"auto",fontSize:10,color:"#E74C3C",fontWeight:500}}>⚠️ Warning</span>}
            </div>
            <div style={{fontSize:11,color:"var(--color-text-secondary)",marginTop:6,marginLeft:28}}>{step.detail}</div>
          </div>
          {idx < path.steps.length - 1 && <div style={connector}/>}
        </div>
      ))}

      <div style={connector}/>

      {/* Filters table */}
      <div style={{...nodeBase, background:"var(--color-background-primary)"}}>
        <div style={{fontWeight:600,color:"var(--color-text-primary)",marginBottom:8,fontSize:13}}>🔍 Filter Pipeline</div>
        <div style={{display:"flex",flexDirection:"column",gap:6}}>
          {path.filters.map((f, i) => (
            <div key={i} style={{display:"flex",alignItems:"center",gap:10,fontSize:11}}>
              <span style={{
                width:8,height:8,borderRadius:"50%",
                background: f.active ? "#27AE60" : "var(--color-border-secondary)",
                flexShrink:0,
              }}/>
              <span style={{width:110,color:"var(--color-text-secondary)",fontWeight:500}}>{f.name}</span>
              <span style={{color:"var(--color-text-tertiary)",flex:1}}>{f.condition}</span>
              <span style={{color:"var(--color-text-secondary)",fontFamily:"var(--font-mono)"}}>
                {f.before} → <strong style={{color:f.active ? "#27AE60" : "inherit"}}>{f.after}</strong>
              </span>
            </div>
          ))}
        </div>
      </div>

      <div style={connector}/>

      {/* Scoring weights */}
      <div style={{...nodeBase, background:"var(--color-background-primary)"}}>
        <div style={{fontWeight:600,color:"var(--color-text-primary)",marginBottom:8,fontSize:13}}>⚖️ Scoring Weights</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {path.scoring.map((s, i) => (
            <div key={i} style={{padding:"6px 8px",background:"var(--color-background-secondary)",borderRadius:"var(--border-radius-sm)",fontSize:11}}>
              <div style={{fontWeight:600,color:"var(--color-text-primary)"}}>{s.name}</div>
              <div style={{color:"var(--color-text-tertiary)",marginTop:2}}>{s.desc}</div>
              <div style={{color:"var(--color-text-info)",fontWeight:500,marginTop:2,fontFamily:"var(--font-mono)"}}>weight = {s.weight}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={connector}/>

      {/* Final formula */}
      <div style={{...nodeBase, background:"#27AE6008", borderColor:"#27AE6033"}}>
        <div style={{fontSize:11,color:"var(--color-text-secondary)",fontFamily:"var(--font-mono)",lineHeight:1.6}}>
          <span style={{color:"#27AE60",fontWeight:600}}>score</span> = 
          sectorMatch(0.40) + peerLink(0.50) + momentum(raw × {HORIZON_MOMENTUM_BOOST[investmentPeriod]}) + valuation(0.30) + lowVol(0.20)
        </div>
      </div>
    </div>
  );
}

export default function EGXRecommender() {
  const [inputSymbol, setInputSymbol] = useState("");
  const [symbolSearch, setSymbolSearch] = useState("");
  const [riskLevel, setRiskLevel] = useState("moderate");
  const [investmentPeriod, setInvestmentPeriod] = useState("medium");
  const [shariahOnly, setShariahOnly] = useState(false);
  const [showQuery, setShowQuery] = useState(false);
  const [showXAI, setShowXAI] = useState(true);
  const [expandedStock, setExpandedStock] = useState(null);
  const [ran, setRan] = useState(false);

  const filteredSymbols = useMemo(() => {
    const q = symbolSearch.toUpperCase();
    if (!q) return ALL_SYMBOLS.slice(0, 50);
    return ALL_SYMBOLS.filter(s => {
      const d = EGX_DATA[s];
      return s.includes(q) || (d.name || "").toUpperCase().includes(q);
    }).slice(0, 50);
  }, [symbolSearch]);

  const { results, query, explanation, inferencePath } = useMemo(() => {
    if (!inputSymbol) return { results: [], query: "", explanation: "", inferencePath: null };
    return sparqlEngine({ inputSymbol, riskLevel, investmentPeriod, shariahOnly, maxResults: 10 });
  }, [inputSymbol, riskLevel, investmentPeriod, shariahOnly]);

  const inputStock = inputSymbol ? EGX_DATA[inputSymbol] : null;

  const riskConfig = {
    conservative: { label: "Conservative", color: "#3A7BD5", icon: "🛡️", vol: "≤ 0.25" },
    moderate: { label: "Moderate", color: "#E67E22", icon: "⚖️", vol: "≤ 0.45" },
    aggressive: { label: "Aggressive", color: "#E74C3C", icon: "🚀", vol: "≤ 1.5" },
  };
  const horizonConfig = {
    short: { label: "Short-term", sub: "< 1 year", boost: "×1.5 momentum" },
    medium: { label: "Medium-term", sub: "1–3 years", boost: "×1.0 momentum" },
    long: { label: "Long-term", sub: "> 3 years", boost: "×0.5 momentum" },
  };

  return (
    <div style={{padding:"1.5rem 0",fontFamily:"var(--font-sans)"}}>
      <h2 style={{fontSize:20,fontWeight:500,margin:"0 0 4px",color:"var(--color-text-primary)"}}>EGX stock recommender</h2>
      <p style={{fontSize:13,color:"var(--color-text-secondary)",margin:"0 0 1.5rem"}}>SPARQL-based · EGX ontology · 197 listed stocks · <strong style={{color:"var(--color-text-info)"}}>XAI-enabled</strong></p>

      {/* Input stock selector */}
      <div style={{marginBottom:"1.25rem"}}>
        <label style={{fontSize:13,fontWeight:500,color:"var(--color-text-secondary)",display:"block",marginBottom:6}}>Seed stock</label>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"flex-start"}}>
          <div style={{position:"relative",flex:"1 1 240px"}}>
            <input
              type="text"
              placeholder="Search symbol or name…"
              value={symbolSearch}
              onChange={e => setSymbolSearch(e.target.value)}
              style={{width:"100%",boxSizing:"border-box"}}
            />
            {symbolSearch && (
              <div style={{position:"absolute",top:"100%",left:0,right:0,background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-primary)",borderRadius:"var(--border-radius-md)",zIndex:100,maxHeight:220,overflowY:"auto",boxShadow:"0 4px 16px rgba(0,0,0,0.08)"}}>
                {filteredSymbols.map(sym => (
                  <div key={sym}
                    onClick={() => { setInputSymbol(sym); setSymbolSearch(""); setRan(true); }}
                    style={{padding:"8px 12px",cursor:"pointer",display:"flex",alignItems:"center",gap:8,borderBottom:"0.5px solid var(--color-border-tertiary)"}}
                    onMouseEnter={e => e.currentTarget.style.background = "var(--color-background-secondary)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <span style={{width:8,height:8,borderRadius:"50%",background:SECTOR_COLORS[EGX_DATA[sym]?.sector]||"#888",flexShrink:0}}/>
                    <span style={{fontWeight:500,fontSize:13,color:"var(--color-text-primary)",minWidth:52}}>{sym}</span>
                    <span style={{fontSize:12,color:"var(--color-text-secondary)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{EGX_DATA[sym]?.name}</span>
                    <span style={{fontSize:11,color:"var(--color-text-tertiary)",marginLeft:"auto",whiteSpace:"nowrap"}}>{EGX_DATA[sym]?.sector}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          {inputStock && <StockBadge symbol={inputSymbol} name={inputStock.name} sector={inputStock.sector} />}
        </div>
      </div>

      {/* Risk & Horizon */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:"1.25rem"}}>
        <div>
          <label style={{fontSize:13,fontWeight:500,color:"var(--color-text-secondary)",display:"block",marginBottom:6}}>Risk level</label>
          <div style={{display:"flex",gap:6}}>
            {Object.entries(riskConfig).map(([k,v]) => (
              <button key={k} onClick={() => setRiskLevel(k)}
                style={{flex:1,padding:"7px 4px",fontSize:12,fontWeight:riskLevel===k?500:400,
                  background:riskLevel===k?v.color:"transparent",
                  color:riskLevel===k?"#fff":"var(--color-text-secondary)",
                  border:riskLevel===k?"none":"0.5px solid var(--color-border-secondary)",
                  borderRadius:"var(--border-radius-md)",cursor:"pointer",transition:"all 0.15s"}}>
                {v.icon} {v.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label style={{fontSize:13,fontWeight:500,color:"var(--color-text-secondary)",display:"block",marginBottom:6}}>Investment horizon</label>
          <div style={{display:"flex",gap:6}}>
            {Object.entries(horizonConfig).map(([k,v]) => (
              <button key={k} onClick={() => setInvestmentPeriod(k)}
                style={{flex:1,padding:"7px 4px",fontSize:12,fontWeight:investmentPeriod===k?500:400,
                  background:investmentPeriod===k?"var(--color-background-info)":"transparent",
                  color:investmentPeriod===k?"var(--color-text-info)":"var(--color-text-secondary)",
                  border:investmentPeriod===k?"0.5px solid var(--color-border-info)":"0.5px solid var(--color-border-secondary)",
                  borderRadius:"var(--border-radius-md)",cursor:"pointer",transition:"all 0.15s"}}>
                {v.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Shariah toggle */}
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:"1.5rem"}}>
        <div onClick={() => setShariahOnly(!shariahOnly)} style={{width:36,height:20,borderRadius:10,background:shariahOnly?"#27AE60":"var(--color-border-secondary)",cursor:"pointer",transition:"background 0.2s",position:"relative"}}>
          <div style={{position:"absolute",top:2,left:shariahOnly?18:2,width:16,height:16,borderRadius:"50%",background:"#fff",transition:"left 0.2s",boxShadow:"0 1px 4px rgba(0,0,0,0.2)"}}/>
        </div>
        <label onClick={() => setShariahOnly(!shariahOnly)} style={{fontSize:13,cursor:"pointer",color:"var(--color-text-secondary)"}}>Shariah-compliant stocks only</label>
      </div>

      {/* Results */}
      {ran && inputStock && (
        <>
          {/* XAI Inference Path */}
          {showXAI && (
            <InferencePathView 
              path={inferencePath} 
              inputSymbol={inputSymbol}
              riskLevel={riskLevel}
              investmentPeriod={investmentPeriod}
              shariahOnly={shariahOnly}
            />
          )}

          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:"1rem"}}>
            <button 
              onClick={() => setShowXAI(!showXAI)}
              style={{fontSize:12,padding:"6px 12px",borderRadius:"var(--border-radius-md)",border:"0.5px solid var(--color-border-secondary)",background:showXAI?"var(--color-background-info)":"transparent",color:showXAI?"var(--color-text-info)":"var(--color-text-secondary)",cursor:"pointer"}}
            >
              {showXAI ? "🧠 Hide" : "🧠 Show"} XAI Inference Path
            </button>
          </div>

          <div style={{background:"var(--color-background-secondary)",borderRadius:"var(--border-radius-md)",padding:"10px 14px",marginBottom:"1rem",fontSize:12,color:"var(--color-text-secondary)"}}>
            <span style={{marginRight:6,fontSize:14}}>ℹ️</span>
            {explanation}
          </div>

          {results.length === 0 ? (
            <div style={{textAlign:"center",padding:"2rem",color:"var(--color-text-tertiary)",fontSize:14}}>
              No stocks match the current filters. Try adjusting risk level or disabling the Shariah filter.
            </div>
          ) : (
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {results.map((s, i) => (
                <div key={s.symbol} style={{background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:"var(--border-radius-lg)",padding:"12px 14px",display:"grid",gridTemplateColumns:"28px 1fr auto",gap:10,alignItems:"start"}}>
                  <span style={{fontSize:12,color:"var(--color-text-tertiary)",paddingTop:2,fontWeight:500}}>#{i+1}</span>
                  <div>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4,flexWrap:"wrap"}}>
                      <span style={{fontWeight:500,fontSize:14,color:"var(--color-text-primary)"}}>{s.symbol}</span>
                      <span style={{fontSize:12,color:"var(--color-text-secondary)"}}>{s.name}</span>
                      <span style={{fontSize:11,padding:"2px 7px",borderRadius:4,background:SECTOR_COLORS[s.sector]+"22",color:SECTOR_COLORS[s.sector],fontWeight:500}}>{s.sector}</span>
                      {s.shariah && <span style={{fontSize:11,padding:"2px 7px",borderRadius:4,background:"#27AE6022",color:"#27AE60",fontWeight:500}}>☪ Shariah</span>}
                      {s.indices && s.indices.includes("EGX30") && <span style={{fontSize:11,padding:"2px 7px",borderRadius:4,background:"#3A7BD522",color:"#3A7BD5",fontWeight:500}}>EGX30</span>}
                    </div>
                    <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:6}}>
                      {s.vol20d !== undefined && <span style={{fontSize:11,color:"var(--color-text-tertiary)"}}>Vol: <strong style={{color:"var(--color-text-secondary)"}}>{s.vol20d.toFixed(3)}</strong></span>}
                      {s.momentum !== undefined && <span style={{fontSize:11,color:"var(--color-text-tertiary)"}}>Mom: <strong style={{color:s.momentum>0?"#27AE60":"#E74C3C"}}>{s.momentum>0?"+":""}{(s.momentum*100).toFixed(1)}%</strong></span>}
                      {s.pb !== undefined && s.pb > 0 && <span style={{fontSize:11,color:"var(--color-text-tertiary)"}}>P/B: <strong style={{color:"var(--color-text-secondary)"}}>{s.pb.toFixed(2)}</strong></span>}
                      {s.mcap && <span style={{fontSize:11,color:"var(--color-text-tertiary)"}}>MCap: <strong style={{color:"var(--color-text-secondary)"}}>{(s.mcap/1e9).toFixed(1)}B EGP</strong></span>}
                    </div>
                    <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:4}}>
                      {s.reasons.map(r => (
                        <span key={r} style={{fontSize:11,padding:"1px 6px",borderRadius:3,background:"var(--color-background-secondary)",color:"var(--color-text-secondary)",border:"0.5px solid var(--color-border-tertiary)"}}>{r}</span>
                      ))}
                    </div>
                    
                    {/* XAI: Expandable score breakdown */}
                    <button
                      onClick={() => setExpandedStock(expandedStock === s.symbol ? null : s.symbol)}
                      style={{
                        fontSize:11,
                        color:"var(--color-text-info)",
                        background:"none",
                        border:"none",
                        padding:0,
                        cursor:"pointer",
                        marginTop:4,
                        fontWeight:500,
                      }}
                    >
                      {expandedStock === s.symbol ? "▲ Hide score breakdown" : "▼ Explain this score"}
                    </button>
                    {expandedStock === s.symbol && (
                      <XAIScoreBreakdown breakdown={s.scoreBreakdown} totalScore={s.score} />
                    )}
                  </div>
                  <ScoreBadge score={s.score} />
                </div>
              ))}
            </div>
          )}

          {/* SPARQL query display */}
          <div style={{marginTop:"1.5rem"}}>
            <button onClick={() => setShowQuery(!showQuery)} style={{fontSize:12,display:"flex",alignItems:"center",gap:6}}>
              <span style={{fontSize:14}}>{`</>`}</span>
              {showQuery ? "Hide" : "Show"} generated SPARQL query
            </button>
            {showQuery && (
              <pre style={{marginTop:8,background:"var(--color-background-secondary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:"var(--border-radius-md)",padding:"12px 14px",fontSize:11,overflowX:"auto",color:"var(--color-text-secondary)",lineHeight:1.7,fontFamily:"var(--font-mono)"}}>
                {query}
              </pre>
            )}
          </div>
        </>
      )}

      {!ran && (
        <div style={{textAlign:"center",padding:"2.5rem 1rem",color:"var(--color-text-tertiary)",fontSize:14,border:"0.5px dashed var(--color-border-tertiary)",borderRadius:"var(--border-radius-lg)"}}>
          <span style={{fontSize:28,display:"block",marginBottom:8}}>🔍</span>
          Search for a seed stock above to generate recommendations
        </div>
      )}
    </div>
  );
}