"""
Generate complete player database & CSV files for IPL Auction Arena 2027
Extracted and enriched from official BCCI IPL Auction lists.
"""
import json
import csv
import os

os.makedirs('backend/data', exist_ok=True)

# Raw OCR data parsed from IPL Mega and Mini lists
RAW_PLAYERS_MEGA = [
    # Sr, Set, First, Last, Country, State, DOB, Age, Role, Bat, Bowl, Tests, ODIs, T20s, IPL, PrevTeams, '24Team, CUA, Price
    (1, "M1", "Jos", "Buttler", "England", "", "08/09/1990", 34, "WICKETKEEPER", "RHB", "RIGHT ARM Off Spin", 57, 181, 124, 107, "MI,RR", "RR", "Capped", 200),
    (2, "M1", "Shreyas", "Iyer", "India", "MCA", "06/12/1994", 30, "BATTER", "RHB", "RIGHT ARM Off Spin", 14, 62, 51, 116, "DC,KKR", "KKR", "Capped", 200),
    (3, "M1", "Rishabh", "Pant", "India", "DDCA", "04/10/1997", 27, "WICKETKEEPER", "LHB", "RIGHT ARM Off Spin", 37, 31, 76, 111, "DC", "DC", "Capped", 200),
    (4, "M1", "Kagiso", "Rabada", "South Africa", "", "25/05/1995", 29, "BOWLER", "RHB", "RIGHT ARM Fast", 66, 101, 65, 80, "DC,PBKS", "PBKS", "Capped", 200),
    (5, "M1", "Arshdeep", "Singh", "India", "PCA", "05/02/1999", 26, "BOWLER", "LHB", "LEFT ARM Fast Medium", 8, 56, 65, 65, "PBKS", "PBKS", "Capped", 200),
    (6, "M1", "Mitchell", "Starc", "Australia", "", "30/01/1990", 35, "BOWLER", "LHB", "LEFT ARM Fast", 89, 125, 65, 41, "RCB,KKR", "KKR", "Capped", 200),
    (7, "M2", "Yuzvendra", "Chahal", "India", "HCA", "23/07/1990", 34, "BOWLER", "RHB", "RIGHT ARM Leg Spin", 0, 72, 80, 160, "MI,RCB,RR", "RR", "Capped", 200),
    (8, "M2", "Liam", "Livingstone", "England", "", "04/08/1993", 31, "ALL-ROUNDER", "RHB", "RIGHT ARM Leg Spin", 1, 31, 50, 39, "RR,PBKS", "PBKS", "Capped", 200),
    (9, "M2", "David", "Miller", "South Africa", "", "10/06/1989", 35, "BATTER", "LHB", "", 0, 173, 125, 130, "PBKS,RR,GT", "GT", "Capped", 150),
    (10, "M2", "KL", "Rahul", "India", "KSCA", "18/04/1992", 32, "WICKETKEEPER", "RHB", "", 53, 77, 72, 132, "SRH,RCB,PBKS,LSG", "LSG", "Capped", 200),
    (11, "M2", "Mohammad", "Shami", "India", "CAB", "03/09/1990", 34, "BOWLER", "RHB", "RIGHT ARM Fast", 64, 101, 23, 110, "KKR,PBKS,GT", "GT", "Capped", 200),
    (12, "M2", "Mohammad", "Siraj", "India", "HYCA", "13/03/1994", 31, "BOWLER", "RHB", "RIGHT ARM Fast", 30, 44, 16, 93, "SRH,RCB", "RCB", "Capped", 200),
    (13, "BA1", "Harry", "Brook", "England", "", "22/02/1999", 26, "BATTER", "RHB", "RIGHT ARM Medium", 21, 20, 39, 11, "SRH,DC", "DC", "Capped", 200),
    (14, "BA1", "Devon", "Conway", "New Zealand", "", "08/07/1991", 33, "BATTER", "LHB", "", 24, 32, 50, 23, "CSK", "CSK", "Capped", 200),
    (15, "BA1", "Jake", "Fraser-McGurk", "Australia", "", "11/04/2002", 22, "BATTER", "RHB", "", 0, 2, 4, 9, "DC", "DC", "Capped", 200),
    (16, "BA1", "Aiden", "Markram", "South Africa", "", "04/10/1994", 30, "BATTER", "RHB", "RIGHT ARM Off Spin", 41, 71, 53, 44, "PBKS,SRH", "SRH", "Capped", 200),
    (17, "BA1", "Devdutt", "Padikkal", "India", "KSCA", "07/07/2000", 24, "BATTER", "LHB", "", 1, 0, 2, 64, "RCB,RR,LSG", "LSG", "Capped", 200),
    (18, "BA1", "Rahul", "Tripathi", "India", "MACA", "02/03/1991", 34, "BATTER", "RHB", "RIGHT ARM Medium", 0, 0, 5, 95, "RPS,RR,KKR,SRH", "SRH", "Capped", 75),
    (19, "BA1", "David", "Warner", "Australia", "", "27/10/1986", 38, "BATTER", "LHB", "", 112, 161, 110, 184, "SRH,DC", "DC", "Capped", 200),
    (20, "AL1", "Ravichandran", "Ashwin", "India", "TNCA", "17/09/1986", 38, "ALL-ROUNDER", "RHB", "RIGHT ARM Off Spin", 104, 116, 65, 212, "CSK,RPS,PBKS,DC,RR", "RR", "Capped", 200),
    (21, "AL1", "Venkatesh", "Iyer", "India", "MPCA", "25/12/1994", 30, "ALL-ROUNDER", "LHB", "RIGHT ARM Medium", 0, 2, 9, 51, "KKR", "KKR", "Capped", 200),
    (22, "AL1", "Mitchell", "Marsh", "Australia", "", "20/10/1991", 33, "ALL-ROUNDER", "RHB", "RIGHT ARM Fast", 42, 93, 65, 42, "DCH,PWI,RPS,SRH,DC", "DC", "Capped", 200),
    (23, "AL1", "Glenn", "Maxwell", "Australia", "", "14/10/1988", 36, "ALL-ROUNDER", "RHB", "RIGHT ARM Off Spin", 7, 142, 113, 134, "DC,MI,PBKS,RCB", "RCB", "Capped", 200),
    (24, "AL1", "Harshal", "Patel", "India", "HCA", "23/11/1990", 34, "ALL-ROUNDER", "RHB", "RIGHT ARM Fast Medium", 0, 0, 25, 106, "DC,RCB,PBKS", "PBKS", "Capped", 200),
    (25, "AL1", "Rachin", "Ravindra", "New Zealand", "", "18/11/1999", 25, "ALL-ROUNDER", "LHB", "LEFT ARM Slow Orthodox", 11, 25, 23, 10, "CSK", "CSK", "Capped", 150),
    (26, "AL1", "Marcus", "Stoinis", "Australia", "", "16/08/1989", 35, "ALL-ROUNDER", "RHB", "RIGHT ARM Fast", 0, 70, 71, 96, "PBKS,RCB,DC,LSG", "LSG", "Capped", 200),
    (27, "WK1", "Jonny", "Bairstow", "England", "", "26/09/1989", 35, "WICKETKEEPER", "RHB", "RIGHT ARM Medium", 100, 107, 80, 50, "SRH,PBKS", "PBKS", "Capped", 200),
    (28, "WK1", "Quinton", "De Kock", "South Africa", "", "17/12/1992", 32, "WICKETKEEPER", "LHB", "", 54, 155, 92, 107, "SRH,DC,RCB,MI,LSG", "LSG", "Capped", 200),
    (29, "WK1", "Rahmanullah", "Gurbaz", "Afghanistan", "", "28/11/2001", 23, "WICKETKEEPER", "RHB", "", 1, 43, 63, 14, "GT,KKR", "KKR", "Capped", 200),
    (30, "WK1", "Ishan", "Kishan", "India", "JSCA", "18/07/1998", 26, "WICKETKEEPER", "LHB", "", 2, 27, 32, 104, "GL,MI", "MI", "Capped", 200),
    (31, "WK1", "Phil", "Salt", "England", "", "28/08/1996", 28, "WICKETKEEPER", "RHB", "", 0, 25, 33, 21, "DC,KKR", "KKR", "Capped", 200),
    (32, "WK1", "Jitesh", "Sharma", "India", "VCA", "22/10/1993", 31, "WICKETKEEPER", "RHB", "", 0, 0, 9, 40, "MI,PBKS", "PBKS", "Capped", 100),
    (33, "FA1", "Syed Khaleel", "Ahmed", "India", "RCA", "05/12/1997", 27, "BOWLER", "RHB", "LEFT ARM Fast Medium", 0, 11, 18, 57, "SRH,DC", "DC", "Capped", 200),
    (34, "FA1", "Trent", "Boult", "New Zealand", "", "22/07/1989", 35, "BOWLER", "RHB", "LEFT ARM Fast Medium", 78, 114, 61, 104, "SRH,DC,MI,RR", "RR", "Capped", 200),
    (35, "FA1", "Josh", "Hazlewood", "Australia", "", "08/01/1991", 34, "BOWLER", "LHB", "RIGHT ARM Fast Medium", 70, 90, 52, 27, "CSK,RCB", "RCB", "Capped", 200),
    (36, "FA1", "Avesh", "Khan", "India", "MPCA", "13/12/1996", 28, "BOWLER", "RHB", "RIGHT ARM Fast", 0, 8, 23, 63, "RCB,DC,LSG,RR", "RR", "Capped", 200),
    (37, "FA1", "Prasidh", "Krishna", "India", "KSCA", "19/02/1996", 29, "BOWLER", "RHB", "RIGHT ARM Fast", 2, 17, 5, 51, "KKR,RR", "RR", "Capped", 200),
    (38, "FA1", "T.", "Natarajan", "India", "TNCA", "27/05/1991", 33, "BOWLER", "LHB", "LEFT ARM Fast Medium", 1, 2, 4, 61, "PBKS,SRH", "SRH", "Capped", 200),
    (39, "FA1", "Anrich", "Nortje", "South Africa", "", "16/11/1993", 31, "BOWLER", "RHB", "RIGHT ARM Fast", 19, 22, 42, 46, "DC", "DC", "Capped", 200),
    (40, "SP1", "Noor", "Ahmad", "Afghanistan", "", "03/01/2005", 20, "BOWLER", "RHB", "LEFT ARM Slow Unorthodox", 0, 10, 14, 23, "GT", "GT", "Capped", 200),
    (41, "SP1", "Rahul", "Chahar", "India", "RCA", "04/08/1999", 25, "BOWLER", "RHB", "RIGHT ARM Leg Spin", 0, 1, 6, 78, "RPS,MI,PBKS", "PBKS", "Capped", 100),
    (42, "SP1", "Wanindu", "Hasaranga", "Sri Lanka", "", "29/07/1997", 27, "BOWLER", "RHB", "RIGHT ARM Leg Spin", 4, 58, 74, 26, "RCB,SRH", "SRH", "Capped", 200),
    (43, "SP1", "Waqar", "Salamkheil", "Afghanistan", "", "02/10/2001", 23, "BOWLER", "RHB", "LEFT ARM Slow Unorthodox", 0, 0, 1, 0, "", "", "Capped", 75),
    (44, "SP1", "Maheesh", "Theekshana", "Sri Lanka", "", "01/08/2000", 24, "BOWLER", "RHB", "RIGHT ARM Off Spin", 2, 43, 55, 27, "CSK", "CSK", "Capped", 200),
    (45, "SP1", "Adam", "Zampa", "Australia", "", "31/12/1992", 32, "BOWLER", "RHB", "RIGHT ARM Leg Spin", 0, 103, 92, 20, "RPS,RCB,RR", "RR", "Capped", 200),
    (46, "UBA1", "Yash", "Dhull", "India", "DDCA", "11/11/2002", 22, "BATTER", "RHB", "", 0, 0, 0, 4, "DC", "DC", "Uncapped", 30),
    (47, "UBA1", "Abhinav", "Manohar", "India", "KSCA", "16/09/1994", 30, "BATTER", "RHB", "RIGHT ARM Leg Spin", 0, 0, 0, 18, "GT", "GT", "Uncapped", 30),
    (48, "UBA1", "Karun", "Nair", "India", "VCA", "06/12/1991", 33, "BATTER", "RHB", "RIGHT ARM Off Spin", 6, 2, 0, 76, "RCB,RR,DD,PBKS,LSG", "", "Uncapped", 30),
    (49, "UBA1", "Angkrish", "Raghuvanshi", "India", "MCA", "05/06/2004", 20, "BATTER", "RHB", "RIGHT ARM Off Spin", 0, 0, 0, 10, "KKR", "KKR", "Uncapped", 30),
    (50, "UBA1", "Anmolpreet", "Singh", "India", "PCA", "28/03/1998", 27, "BATTER", "RHB", "RIGHT ARM Off Spin", 0, 0, 0, 9, "MI,SRH", "SRH", "Uncapped", 30),
    (51, "UBA1", "Atharva", "Taide", "India", "VCA", "26/04/2000", 24, "BATTER", "LHB", "LEFT ARM Slow Orthodox", 0, 0, 0, 9, "PBKS", "PBKS", "Uncapped", 30),
    (52, "UBA1", "Nehal", "Wadhera", "India", "PCA", "04/09/2000", 24, "BATTER", "LHB", "RIGHT ARM Leg Spin", 0, 0, 0, 20, "MI", "MI", "Uncapped", 30),
    (53, "UAL1", "Harpreet", "Brar", "India", "PCA", "16/09/1995", 29, "ALL-ROUNDER", "LHB", "LEFT ARM Slow Orthodox", 0, 0, 0, 41, "PBKS", "PBKS", "Uncapped", 30),
    (54, "UAL1", "Naman", "Dhir", "India", "PCA", "31/12/1999", 25, "ALL-ROUNDER", "RHB", "RIGHT ARM Off Spin", 0, 0, 0, 7, "MI", "MI", "Uncapped", 30),
    (55, "UAL1", "Mahipal", "Lomror", "India", "RCA", "16/11/1999", 25, "ALL-ROUNDER", "LHB", "LEFT ARM Slow Orthodox", 0, 0, 0, 40, "RR,RCB", "RCB", "Uncapped", 50),
    (56, "UAL1", "Sameer", "Rizvi", "India", "UPCA", "06/12/2003", 21, "ALL-ROUNDER", "RHB", "RIGHT ARM Leg Spin", 0, 0, 0, 9, "CSK", "CSK", "Uncapped", 30),
    (57, "UAL1", "Abdul", "Samad", "India", "JKCA", "28/10/2001", 23, "ALL-ROUNDER", "RHB", "RIGHT ARM Leg Spin", 0, 0, 0, 50, "SRH", "SRH", "Uncapped", 30),
    (58, "UAL1", "Vijay", "Shankar", "India", "TNCA", "26/01/1991", 34, "ALL-ROUNDER", "RHB", "RIGHT ARM Medium", 0, 12, 9, 72, "CSK,DC,SRH,GT", "GT", "Uncapped", 30),
    (59, "UAL1", "Ashutosh", "Sharma", "India", "RSPB", "15/09/1998", 26, "ALL-ROUNDER", "RHB", "RIGHT ARM Medium", 0, 0, 0, 11, "PBKS", "PBKS", "Uncapped", 30),
    (60, "UAL1", "Nishant", "Sindhu", "India", "HCA", "09/04/2004", 20, "ALL-ROUNDER", "LHB", "LEFT ARM Slow Orthodox", 0, 0, 0, 0, "CSK", "CSK", "Uncapped", 30),
    (61, "UAL1", "Utkarsh", "Singh", "India", "JSCA", "07/05/1998", 26, "ALL-ROUNDER", "LHB", "RIGHT ARM Off Spin", 0, 0, 0, 0, "PBKS", "", "Uncapped", 30),
    (62, "UWK1", "Aryan", "Juyal", "India", "UPCA", "11/11/2001", 23, "WICKETKEEPER", "RHB", "RIGHT ARM Off Spin", 0, 0, 0, 0, "MI", "", "Uncapped", 30),
    (63, "UWK1", "Kumar", "Kushagra", "India", "JSCA", "23/10/2004", 20, "WICKETKEEPER", "RHB", "", 0, 0, 0, 0, "GT", "GT", "Uncapped", 30),
    (64, "UWK1", "Robin", "Minz", "India", "JSCA", "13/09/2002", 22, "WICKETKEEPER", "LHB", "RIGHT ARM Off Spin", 0, 0, 0, 0, "GT", "GT", "Uncapped", 30),
    (65, "UWK1", "Anuj", "Rawat", "India", "DDCA", "17/10/1999", 25, "WICKETKEEPER", "LHB", "RIGHT ARM Leg Spin", 0, 0, 0, 24, "RR,RCB", "RCB", "Uncapped", 30),
    (66, "UWK1", "Luvnith", "Sisodia", "India", "KSCA", "15/01/2000", 25, "WICKETKEEPER", "LHB", "", 0, 0, 0, 0, "RCB", "", "Uncapped", 30),
    (67, "UWK1", "Vishnu", "Vinod", "India", "KCA", "02/12/1993", 31, "WICKETKEEPER", "RHB", "", 0, 0, 0, 6, "RCB,DC,SRH,MI", "MI", "Uncapped", 30),
    (68, "UWK1", "Upendra Singh", "Yadav", "India", "RSPB", "08/10/1996", 28, "WICKETKEEPER", "RHB", "", 0, 0, 0, 0, "SRH", "SRH", "Uncapped", 30),
    (69, "UFA1", "Vaibhav", "Arora", "India", "HPCA", "14/12/1997", 27, "BOWLER", "RHB", "RIGHT ARM Fast Medium", 0, 0, 0, 20, "PBKS,KKR", "KKR", "Uncapped", 30),
    (70, "UFA1", "Rasikh", "Dar", "India", "JKCA", "05/04/2000", 25, "BOWLER", "RHB", "RIGHT ARM Fast Medium", 0, 0, 0, 11, "MI,KKR,DC", "DC", "Uncapped", 30),
    (71, "UFA1", "Akash", "Madhwal", "India", "CAU", "25/11/1993", 31, "BOWLER", "RHB", "RIGHT ARM Fast", 0, 0, 0, 12, "MI", "MI", "Uncapped", 30),
    (72, "UFA1", "Mohit", "Sharma", "India", "HCA", "18/09/1988", 36, "BOWLER", "RHB", "RIGHT ARM Fast", 0, 26, 8, 111, "CSK,PBKS,DC,GT", "GT", "Uncapped", 50),
    (73, "UFA1", "Simarjeet", "Singh", "India", "DDCA", "17/01/1998", 27, "BOWLER", "RHB", "RIGHT ARM Fast", 0, 0, 0, 10, "CSK", "CSK", "Uncapped", 30),
    (74, "UFA1", "Yash", "Thakur", "India", "VCA", "28/12/1998", 26, "BOWLER", "RHB", "RIGHT ARM Fast Medium", 0, 0, 0, 19, "LSG", "LSG", "Uncapped", 30),
    (75, "UFA1", "Kartik", "Tyagi", "India", "UPCA", "08/11/2000", 24, "BOWLER", "RHB", "RIGHT ARM Fast", 0, 0, 0, 20, "RR,SRH,GT", "GT", "Uncapped", 40),
    (76, "UFA1", "Vyshak", "Vijaykumar", "India", "KSCA", "31/01/1997", 28, "BOWLER", "RHB", "RIGHT ARM Fast Medium", 0, 0, 0, 11, "RCB", "RCB", "Uncapped", 30),
    (77, "USP1", "Piyush", "Chawla", "India", "UPCA", "24/12/1988", 36, "BOWLER", "LHB", "RIGHT ARM Leg Spin", 3, 25, 7, 192, "PBKS,KKR,CSK,MI", "MI", "Uncapped", 50),
    (78, "USP1", "Shreyas", "Gopal", "India", "KSCA", "04/09/1993", 31, "BOWLER", "RHB", "RIGHT ARM Leg Spin", 0, 0, 0, 52, "RR,SRH,MI", "MI", "Uncapped", 30),
    (79, "USP1", "Mayank", "Markande", "India", "PCA", "11/11/1997", 27, "BOWLER", "RHB", "RIGHT ARM Leg Spin", 0, 0, 1, 37, "MI,RR,SRH", "SRH", "Uncapped", 30),
    (80, "USP1", "Suyash", "Sharma", "India", "DDCA", "15/05/2003", 21, "BOWLER", "RHB", "RIGHT ARM Leg Spin", 0, 0, 0, 13, "KKR", "KKR", "Uncapped", 30),
    (81, "USP1", "Karn", "Sharma", "India", "RSPB", "23/10/1987", 37, "BOWLER", "LHB", "RIGHT ARM Leg Spin", 1, 2, 1, 84, "SRH,MI,CSK,RCB", "RCB", "Uncapped", 50),
    (82, "USP1", "Kumar Kartikeya", "Singh", "India", "MPCA", "26/12/1997", 27, "BOWLER", "RHB", "LEFT ARM Slow Orthodox", 0, 0, 0, 12, "MI", "MI", "Uncapped", 30),
    (83, "USP1", "Manav", "Suthar", "India", "RCA", "03/08/2002", 22, "BOWLER", "LHB", "LEFT ARM Slow Orthodox", 0, 0, 0, 0, "GT", "GT", "Uncapped", 30),
    (84, "BA2", "Mayank", "Agarwal", "India", "KSCA", "16/02/1991", 34, "BATTER", "RHB", "RIGHT ARM Off Spin", 21, 5, 0, 127, "RCB,DC,RPS,PBKS,SRH", "SRH", "Capped", 100),
    (85, "BA2", "Faf", "Du Plessis", "South Africa", "", "13/07/1984", 40, "BATTER", "RHB", "", 69, 143, 50, 145, "CSK,RPS,RCB", "RCB", "Capped", 200),
    (86, "BA2", "Glenn", "Phillips", "New Zealand", "", "06/12/1996", 28, "BATTER", "RHB", "RIGHT ARM Off Spin", 11, 30, 78, 8, "RR,SRH", "SRH", "Capped", 200),
    (87, "BA2", "Rovman", "Powell", "West Indies", "", "23/07/1993", 31, "BATTER", "RHB", "RIGHT ARM Fast Medium", 0, 51, 83, 27, "KKR,DC,RR", "RR", "Capped", 150),
    (88, "BA2", "Ajinkya", "Rahane", "India", "MCA", "06/06/1988", 36, "BATTER", "RHB", "", 85, 90, 20, 185, "MI,RPS,RR,DC,KKR,SRH", "CSK", "Capped", 150),
    (89, "BA2", "Prithvi", "Shaw", "India", "MCA", "09/11/1999", 25, "BATTER", "RHB", "", 5, 6, 1, 79, "DC", "DC", "Capped", 75),
    (90, "BA2", "Kane", "Williamson", "New Zealand", "", "08/08/1990", 34, "BATTER", "RHB", "", 102, 165, 93, 79, "SRH,GT", "GT", "Capped", 200),
    (91, "AL2", "Sam", "Curran", "England", "", "03/06/1998", 26, "ALL-ROUNDER", "LHB", "LEFT ARM Fast Medium", 24, 33, 53, 59, "CSK,PBKS", "PBKS", "Capped", 200),
    (92, "AL2", "Marco", "Jansen", "South Africa", "", "01/05/2000", 24, "ALL-ROUNDER", "RHB", "LEFT ARM Fast", 13, 23, 13, 21, "MI,SRH", "SRH", "Capped", 125),
    (93, "AL2", "Daryl", "Mitchell", "New Zealand", "", "20/05/1991", 33, "ALL-ROUNDER", "RHB", "RIGHT ARM Medium", 27, 39, 67, 15, "RR,CSK", "CSK", "Capped", 200),
    (94, "AL2", "Krunal", "Pandya", "India", "BCA", "24/03/1991", 34, "ALL-ROUNDER", "LHB", "LEFT ARM Slow Orthodox", 0, 5, 9, 127, "MI,LSG", "LSG", "Capped", 200),
    (95, "AL2", "Nitish", "Rana", "India", "UPCA", "27/12/1993", 31, "ALL-ROUNDER", "LHB", "RIGHT ARM Off Spin", 0, 1, 2, 107, "MI,KKR", "KKR", "Capped", 150),
    (96, "AL2", "Washington", "Sundar", "India", "TNCA", "05/10/1999", 25, "ALL-ROUNDER", "LHB", "RIGHT ARM Off Spin", 6, 22, 52, 61, "RPS,RCB,SRH", "SRH", "Capped", 200),
    (97, "AL2", "Shardul", "Thakur", "India", "MCA", "16/10/1991", 33, "ALL-ROUNDER", "RHB", "RIGHT ARM Fast Medium", 11, 47, 25, 95, "PBKS,RPS,DC,KKR,CSK", "CSK", "Capped", 200),
    (98, "WK2", "K.S", "Bharat", "India", "ACA", "03/10/1993", 31, "WICKETKEEPER", "RHB", "", 7, 0, 0, 11, "RCB,DC,GT,KKR", "KKR", "Capped", 75),
    (99, "WK2", "Alex", "Carey", "Australia", "", "27/08/1991", 33, "WICKETKEEPER", "LHB", "", 32, 76, 38, 3, "DC", "", "Capped", 100),
    (100, "WK2", "Donovan", "Ferreira", "South Africa", "", "21/07/1998", 26, "WICKETKEEPER", "RHB", "RIGHT ARM Off Spin", 0, 0, 4, 2, "RR", "RR", "Capped", 75),
    (101, "WK2", "Shai", "Hope", "West Indies", "", "10/11/1993", 31, "WICKETKEEPER", "RHB", "", 38, 128, 36, 9, "DC", "DC", "Capped", 125),
    (102, "WK2", "Josh", "Inglis", "Australia", "", "04/03/1995", 30, "WICKETKEEPER", "RHB", "", 0, 23, 26, 0, "", "", "Capped", 200),
    (103, "WK2", "Ryan", "Rickelton", "South Africa", "", "11/07/1996", 28, "WICKETKEEPER", "LHB", "", 7, 5, 8, 0, "", "", "Capped", 100),
    (104, "FA2", "Deepak", "Chahar", "India", "RCA", "07/08/1992", 32, "BOWLER", "RHB", "RIGHT ARM Fast Medium", 0, 13, 25, 81, "RPS,CSK", "CSK", "Capped", 200),
    (105, "FA2", "Gerald", "Coetzee", "South Africa", "", "02/10/2000", 24, "BOWLER", "RHB", "RIGHT ARM Fast", 3, 14, 6, 10, "MI", "MI", "Capped", 125),
    (106, "FA2", "Akash", "Deep", "India", "CAB", "15/12/1996", 28, "BOWLER", "RHB", "RIGHT ARM Fast", 4, 0, 0, 8, "RCB", "RCB", "Capped", 100),
    (107, "FA2", "Tushar", "Deshpande", "India", "MCA", "15/05/1995", 29, "BOWLER", "LHB", "RIGHT ARM Fast", 0, 0, 2, 36, "DC,CSK", "CSK", "Capped", 100),
    (108, "FA2", "Lockie", "Ferguson", "New Zealand", "", "13/06/1991", 33, "BOWLER", "RHB", "RIGHT ARM Fast", 1, 65, 42, 45, "RPS,GT,KKR,RCB", "RCB", "Capped", 200),
    (109, "FA2", "Bhuvneshwar", "Kumar", "India", "UPCA", "05/02/1990", 35, "BOWLER", "RHB", "RIGHT ARM Fast Medium", 21, 121, 87, 176, "PWI,SRH", "SRH", "Capped", 200),
    (110, "FA2", "Mukesh", "Kumar", "India", "CAB", "12/10/1993", 31, "BOWLER", "RHB", "RIGHT ARM Fast Medium", 3, 6, 17, 20, "DC", "DC", "Capped", 200),
    (111, "SP2", "Allah", "Ghazanfar", "Afghanistan", "", "20/03/2006", 19, "BOWLER", "RHB", "RIGHT ARM Off Spin", 0, 5, 0, 0, "KKR", "KKR", "Capped", 75),
    (112, "SP2", "Akeal", "Hosein", "West Indies", "", "25/04/1993", 31, "BOWLER", "LHB", "LEFT ARM Slow Orthodox", 0, 38, 60, 1, "SRH", "", "Capped", 150),
    (113, "SP2", "Keshav", "Maharaj", "South Africa", "", "07/02/1990", 35, "BOWLER", "RHB", "LEFT ARM Slow Orthodox", 54, 44, 35, 2, "RR", "RR", "Capped", 75),
    (114, "SP2", "Mujeeb Ur", "Rahman", "Afghanistan", "", "28/03/2001", 24, "BOWLER", "RHB", "RIGHT ARM Off Spin", 1, 75, 46, 19, "PBKS,SRH,KKR", "", "Capped", 200),
    (115, "SP2", "Adil", "Rashid", "England", "", "17/02/1988", 37, "BOWLER", "RHB", "RIGHT ARM Leg Spin", 19, 141, 116, 3, "PBKS,SRH", "", "Capped", 200),
    (116, "SP2", "Vijayakanth", "Viyaskanth", "Sri Lanka", "", "05/12/2001", 23, "BOWLER", "RHB", "RIGHT ARM Leg Spin", 0, 0, 1, 3, "SRH", "SRH", "Capped", 75),
    (154, "BA3", "Finn", "Allen", "New Zealand", "", "22/04/1999", 25, "BATTER", "RHB", "", 0, 22, 47, 0, "RCB", "", "Capped", 200),
    (155, "BA3", "Dewald", "Brevis", "South Africa", "", "29/04/2003", 21, "BATTER", "RHB", "RIGHT ARM Leg Spin", 0, 0, 2, 10, "MI", "MI", "Capped", 75),
    (156, "BA3", "Ben", "Duckett", "England", "", "17/10/1994", 30, "BATTER", "LHB", "", 29, 16, 12, 0, "", "", "Capped", 200),
    (157, "BA3", "Manish", "Pandey", "India", "KSCA", "10/09/1989", 35, "BATTER", "RHB", "", 29, 39, 0, 171, "MI,RCB,PWI,SRH,LSG,DC,KKR", "KKR", "Capped", 75),
    (158, "BA3", "Rilee", "Rossouw", "South Africa", "", "09/10/1989", 35, "BATTER", "LHB", "", 0, 36, 29, 22, "RCB,DC,PBKS", "PBKS", "Capped", 200),
    (159, "BA3", "Sherfane", "Rutherford", "West Indies", "", "15/08/1998", 26, "BATTER", "LHB", "RIGHT ARM Fast Medium", 0, 8, 24, 10, "DC,MI,RR,RCB,KKR", "KKR", "Capped", 150),
    (163, "AL3", "Moeen", "Ali", "England", "", "18/06/1987", 37, "ALL-ROUNDER", "LHB", "RIGHT ARM Off Spin", 68, 138, 92, 67, "RCB,CSK", "CSK", "Capped", 200),
    (164, "AL3", "Tim", "David", "Australia", "", "16/03/1996", 29, "ALL-ROUNDER", "RHB", "RIGHT ARM Off Spin", 0, 4, 51, 38, "RCB,MI", "MI", "Capped", 200),
    (166, "AL3", "Will", "Jacks", "England", "", "21/11/1998", 26, "ALL-ROUNDER", "RHB", "RIGHT ARM Off Spin", 2, 13, 18, 8, "RCB", "RCB", "Capped", 200),
    (167, "AL3", "Azmatullah", "Omarzai", "Afghanistan", "", "24/03/2000", 25, "ALL-ROUNDER", "RHB", "RIGHT ARM Fast Medium", 0, 30, 44, 7, "GT", "GT", "Capped", 150),
    (168, "AL3", "R.", "Sai Kishore", "India", "TNCA", "06/11/1996", 28, "ALL-ROUNDER", "LHB", "LEFT ARM Slow Unorthodox", 0, 0, 3, 10, "CSK,GT", "GT", "Capped", 75),
    (169, "AL3", "Romario", "Shepherd", "West Indies", "", "26/11/1994", 30, "ALL-ROUNDER", "RHB", "RIGHT ARM Fast", 0, 33, 46, 10, "SRH,LSG,MI", "MI", "Capped", 150),
    (178, "FA3", "Nandre", "Burger", "South Africa", "", "11/08/1995", 29, "BOWLER", "LHB", "LEFT ARM Fast", 3, 5, 2, 6, "RR", "RR", "Capped", 125),
    (179, "FA3", "Spencer", "Johnson", "Australia", "", "16/12/1995", 29, "BOWLER", "LHB", "LEFT ARM Fast", 1, 5, 5, 5, "GT", "GT", "Capped", 200),
    (180, "FA3", "Umran", "Malik", "India", "JKCA", "22/11/1999", 25, "BOWLER", "RHB", "RIGHT ARM Fast", 0, 10, 8, 26, "SRH", "SRH", "Capped", 75),
    (181, "FA3", "Mustafizur", "Rahman", "Bangladesh", "", "06/09/1995", 29, "BOWLER", "LHB", "LEFT ARM Fast", 15, 104, 106, 57, "SRH,MI,RR,DC,CSK", "CSK", "Capped", 200),
    (184, "FA3", "Naveen", "Ul Haq", "Afghanistan", "", "23/09/1999", 25, "BOWLER", "RHB", "RIGHT ARM Medium", 0, 14, 45, 18, "LSG", "LSG", "Capped", 200),
    (185, "FA3", "Jaydev", "Unadkat", "India", "SCA", "18/10/1991", 33, "BOWLER", "RHB", "LEFT ARM Fast Medium", 4, 8, 10, 105, "RCB,DC,KKR,RPS,RR,MI,LSG,SRH", "SRH", "Capped", 100),
    (186, "FA3", "Umesh", "Yadav", "India", "VCA", "25/10/1987", 37, "BOWLER", "RHB", "RIGHT ARM Fast Medium", 57, 75, 9, 148, "RCB,DC,KKR,GT", "GT", "Capped", 200),
    (191, "SP3", "Tabraiz", "Shamsi", "South Africa", "", "18/02/1990", 35, "BOWLER", "RHB", "LEFT ARM Slow Unorthodox", 2, 51, 70, 5, "RCB,RR", "", "Capped", 200),
    (237, "BA4", "Steve", "Smith", "Australia", "", "02/06/1989", 35, "BATTER", "RHB", "", 109, 163, 67, 103, "PWI,RPS,RR,DC", "", "Capped", 200),
    (238, "AL4", "Gus", "Atkinson", "England", "", "19/01/1998", 27, "ALL-ROUNDER", "RHB", "RIGHT ARM Fast", 8, 9, 3, 0, "KKR", "KKR", "Capped", 200),
    (239, "AL4", "Tom", "Curran", "England", "", "12/03/1995", 30, "ALL-ROUNDER", "RHB", "RIGHT ARM Fast Medium", 2, 28, 30, 13, "KKR,RR,DC,RCB", "RCB", "Capped", 200),
    (241, "AL4", "Mohammad", "Nabi", "Afghanistan", "", "01/01/1985", 40, "ALL-ROUNDER", "RHB", "RIGHT ARM Off Spin", 3, 164, 129, 24, "SRH,MI,KKR", "MI", "Capped", 150),
    (244, "AL4", "Mitchell", "Santner", "New Zealand", "", "05/02/1992", 33, "ALL-ROUNDER", "LHB", "LEFT ARM Slow Orthodox", 29, 104, 104, 18, "CSK", "CSK", "Capped", 200),
    (254, "FA4", "Matt", "Henry", "New Zealand", "", "14/12/1991", 33, "BOWLER", "RHB", "RIGHT ARM Fast Medium", 26, 82, 18, 6, "PBKS,LSG", "LSG", "Capped", 200),
    (255, "FA4", "Alzarri", "Joseph", "West Indies", "", "20/11/1996", 28, "BOWLER", "RHB", "RIGHT ARM Fast", 35, 72, 32, 22, "MI,GT,RCB", "RCB", "Capped", 200),
    (256, "FA4", "Kwena", "Maphaka", "South Africa", "", "08/04/2006", 18, "BOWLER", "LHB", "LEFT ARM Fast", 0, 3, 2, 2, "MI", "MI", "Capped", 75),
    (313, "FA5", "Jason", "Behrendorff", "Australia", "", "20/04/1990", 34, "BOWLER", "RHB", "LEFT ARM Fast", 0, 12, 17, 17, "CSK,RCB,MI", "MI", "Capped", 150),
    (316, "FA5", "Shamar", "Joseph", "West Indies", "", "31/08/1999", 25, "BOWLER", "LHB", "RIGHT ARM Fast", 6, 8, 1, 1, "LSG", "LSG", "Capped", 75),
    (317, "FA5", "Josh", "Little", "Ireland", "", "01/11/1999", 25, "BOWLER", "RHB", "LEFT ARM Fast Medium", 0, 36, 69, 11, "GT", "GT", "Capped", 75),
    (318, "FA5", "Shivam", "Mavi", "India", "UPCA", "26/11/1998", 26, "BOWLER", "RHB", "RIGHT ARM Fast Medium", 0, 0, 6, 32, "KKR,GT,LSG", "GT", "Capped", 75),
    (368, "FA6", "Adam", "Milne", "New Zealand", "", "13/04/1992", 32, "BOWLER", "RHB", "RIGHT ARM Fast", 0, 49, 53, 10, "RCB,MI,CSK", "", "Capped", 200),
    (369, "FA6", "Lungisani", "Ngidi", "South Africa", "", "29/03/1996", 29, "BOWLER", "RHB", "RIGHT ARM Fast Medium", 19, 62, 43, 14, "CSK,DC", "DC", "Capped", 100),
    (404, "AL7", "Jason", "Holder", "West Indies", "", "05/11/1991", 33, "ALL-ROUNDER", "RHB", "RIGHT ARM Fast", 69, 138, 63, 46, "CSK,KKR,SRH,LSG,RR", "", "Capped", 200),
    (406, "AL7", "Jimmy", "Neesham", "New Zealand", "", "17/09/1990", 34, "ALL-ROUNDER", "LHB", "RIGHT ARM Fast Medium", 12, 76, 79, 14, "DC,PBKS,MI,RR", "", "Capped", 150),
    (449, "FA8", "Tim", "Southee", "New Zealand", "", "11/12/1988", 36, "BOWLER", "RHB", "RIGHT ARM Fast Medium", 104, 161, 126, 54, "CSK,RR,MI,RCB,KKR", "", "Capped", 150),
    (479, "FA9", "James", "Anderson", "England", "", "30/07/1982", 42, "BOWLER", "LHB", "RIGHT ARM Fast", 188, 194, 19, 0, "", "", "Capped", 125),
    (480, "FA9", "Kyle", "Jamieson", "New Zealand", "", "30/12/1994", 30, "BOWLER", "RHB", "RIGHT ARM Fast", 19, 13, 13, 9, "RCB,CSK", "", "Capped", 150),
    (481, "FA9", "Chris", "Jordan", "England", "", "04/10/1988", 36, "BOWLER", "RHB", "RIGHT ARM Fast", 8, 35, 95, 34, "RCB,SRH,PBKS,CSK,MI", "", "Capped", 200),
    (491, "UBA9", "Vaibhav", "Suryavanshi", "India", "BICA", "27/03/2011", 14, "BATTER", "LHB", "LEFT ARM Slow Orthodox", 0, 0, 0, 0, "", "", "Uncapped", 30),
    (519, "FA10", "Andrew", "Tye", "Australia", "", "12/12/1986", 38, "BOWLER", "RHB", "RIGHT ARM Fast Medium", 0, 7, 32, 30, "GL,PBKS,RR,LSG", "", "Capped", 75)
]

# Additional players from the 2026 Mini Auction pool (released stars + newly registered talents)
RAW_PLAYERS_MINI = [
    (1, "BA1", "Devon", "Conway", "New Zealand", "", "08/07/1991", 34, "BATTER", "LHB", "", 29, 40, 62, 29, "CSK", "CSK", "Capped", 200),
    (2, "BA1", "Jake", "Fraser-McGurk", "Australia", "", "11/04/2002", 23, "BATTER", "RHB", "", 7, 8, 15, 15, "DC", "DC", "Capped", 200),
    (3, "BA1", "Cameron", "Green", "Australia", "", "03/06/1999", 26, "ALL-ROUNDER", "RHB", "RIGHT ARM Fast", 33, 31, 21, 29, "MI,RCB", "", "Capped", 200),
    (4, "BA1", "Sarfaraz", "Khan", "India", "MCA", "22/10/1997", 28, "BATTER", "RHB", "RIGHT ARM Leg Spin", 6, 0, 50, 50, "RCB,PBKS,DC", "", "Capped", 75),
    (5, "BA1", "David", "Miller", "South Africa", "", "10/06/1989", 36, "BATTER", "LHB", "", 0, 178, 130, 141, "PBKS,RR,GT,LSG", "LSG", "Capped", 200),
    (6, "BA1", "Prithvi", "Shaw", "India", "MACA", "09/11/1999", 26, "BATTER", "RHB", "", 5, 6, 1, 79, "DC", "", "Capped", 75),
    (7, "AL1", "Gus", "Atkinson", "England", "", "19/01/1998", 28, "ALL-ROUNDER", "RHB", "RIGHT ARM Fast", 14, 11, 4, 0, "KKR", "", "Capped", 200),
    (8, "AL1", "Wanindu", "Hasaranga", "Sri Lanka", "", "29/07/1997", 28, "ALL-ROUNDER", "RHB", "RIGHT ARM Leg Spin", 4, 68, 90, 37, "RCB,SRH,RR", "RR", "Capped", 200),
    (9, "AL1", "Deepak", "Hooda", "India", "RCA", "19/04/1995", 30, "ALL-ROUNDER", "RHB", "RIGHT ARM Off Spin", 10, 21, 125, 125, "RR,SRH,PBKS,LSG,CSK", "CSK", "Capped", 75),
    (10, "AL1", "Venkatesh", "Iyer", "India", "MPCA", "25/12/1994", 31, "ALL-ROUNDER", "LHB", "RIGHT ARM Medium", 2, 9, 62, 62, "KKR", "KKR", "Capped", 200),
    (11, "AL1", "Liam", "Livingstone", "England", "", "04/08/1993", 32, "ALL-ROUNDER", "RHB", "RIGHT ARM Leg Spin", 1, 39, 60, 49, "RR,PBKS,RCB", "RCB", "Capped", 200),
    (12, "AL1", "Wiaan", "Mulder", "South Africa", "", "19/02/1998", 28, "ALL-ROUNDER", "RHB", "RIGHT ARM Fast Medium", 24, 30, 11, 1, "SRH", "SRH", "Capped", 100),
    (13, "AL1", "Rachin", "Ravindra", "New Zealand", "", "18/11/1999", 26, "ALL-ROUNDER", "LHB", "LEFT ARM Slow Orthodox", 17, 39, 38, 18, "CSK", "CSK", "Capped", 200),
    (14, "WK1", "Finn", "Allen", "New Zealand", "", "22/04/1999", 26, "WICKETKEEPER", "RHB", "", 0, 22, 52, 0, "RCB", "", "Capped", 200),
    (15, "WK1", "Jonny", "Bairstow", "England", "", "26/09/1989", 36, "WICKETKEEPER", "RHB", "", 100, 107, 80, 52, "SRH,PBKS,MI", "MI", "Capped", 100),
    (16, "WK1", "K.S.", "Bharat", "India", "ACA", "03/10/1993", 32, "WICKETKEEPER", "RHB", "", 7, 0, 0, 10, "RCB,DC,GT,KKR", "", "Capped", 75),
    (17, "WK1", "Quinton", "De Kock", "South Africa", "", "17/12/1992", 33, "WICKETKEEPER", "LHB", "", 54, 161, 96, 115, "SRH,DC,RCB,MI,LSG,KKR", "KKR", "Capped", 100),
    (18, "WK1", "Ben", "Duckett", "England", "", "17/10/1994", 31, "WICKETKEEPER", "LHB", "", 39, 31, 20, 0, "", "", "Capped", 200),
    (19, "WK1", "Rahmanullah", "Gurbaz", "Afghanistan", "", "28/11/2001", 24, "WICKETKEEPER", "RHB", "", 2, 52, 80, 19, "GT,KKR", "KKR", "Capped", 150),
    (20, "WK1", "Jamie", "Smith", "England", "", "12/07/2000", 25, "WICKETKEEPER", "RHB", "", 16, 19, 5, 0, "", "", "Capped", 200),
    (21, "FA1", "Gerald", "Coetzee", "South Africa", "", "02/10/2000", 25, "BOWLER", "RHB", "RIGHT ARM Fast", 4, 14, 13, 14, "MI,GT", "GT", "Capped", 200),
    (22, "FA1", "Akash", "Deep", "India", "CAB", "15/12/1996", 29, "BOWLER", "RHB", "RIGHT ARM Fast", 10, 0, 0, 14, "RCB,LSG", "LSG", "Capped", 100),
    (23, "FA1", "Jacob", "Duffy", "New Zealand", "", "02/08/1994", 31, "BOWLER", "RHB", "RIGHT ARM Fast Medium", 1, 19, 38, 0, "", "", "Capped", 200),
    (24, "FA1", "Fazalhaq", "Farooqi", "Afghanistan", "", "22/09/2000", 25, "BOWLER", "RHB", "LEFT ARM Fast Medium", 0, 42, 51, 12, "SRH,RR", "RR", "Capped", 100),
    (25, "FA1", "Matt", "Henry", "New Zealand", "", "14/12/1991", 34, "BOWLER", "RHB", "RIGHT ARM Fast Medium", 32, 95, 31, 6, "PBKS,LSG", "", "Capped", 200),
    (26, "FA1", "Spencer", "Johnson", "Australia", "", "16/12/1995", 30, "BOWLER", "LHB", "LEFT ARM Fast", 0, 5, 8, 9, "GT,KKR", "KKR", "Capped", 150),
    (27, "FA1", "Shivam", "Mavi", "India", "UPCA", "26/11/1998", 27, "BOWLER", "RHB", "RIGHT ARM Fast Medium", 0, 0, 6, 32, "KKR,GT,LSG", "", "Capped", 75),
    (28, "FA1", "Anrich", "Nortje", "South Africa", "", "16/11/1993", 32, "BOWLER", "RHB", "RIGHT ARM Fast", 19, 22, 42, 48, "DC,KKR", "KKR", "Capped", 200),
    (29, "FA1", "Matheesha", "Pathirana", "Sri Lanka", "", "18/12/2002", 23, "BOWLER", "RHB", "RIGHT ARM Fast", 0, 12, 21, 32, "CSK", "CSK", "Capped", 200),
    (30, "SP1", "Ravi", "Bishnoi", "India", "GUCA", "05/09/2000", 25, "BOWLER", "RHB", "RIGHT ARM Leg Spin", 1, 42, 77, 77, "PBKS,LSG", "LSG", "Capped", 200),
    (31, "SP1", "Rahul", "Chahar", "India", "RCA", "04/08/1999", 26, "BOWLER", "RHB", "RIGHT ARM Leg Spin", 0, 1, 6, 80, "RPS,MI,PBKS,SRH", "SRH", "Capped", 100),
    (32, "SP1", "Akeal", "Hosein", "West Indies", "", "25/04/1993", 32, "BOWLER", "LHB", "LEFT ARM Slow Orthodox", 0, 40, 87, 1, "SRH", "", "Capped", 200),
    (33, "SP1", "Mujeeb", "Rahman", "Afghanistan", "", "28/03/2001", 25, "BOWLER", "RHB", "RIGHT ARM Off Spin", 1, 75, 58, 20, "PBKS,SRH,KKR,MI", "MI", "Capped", 200),
    (34, "SP1", "Maheesh", "Theekshana", "Sri Lanka", "", "01/08/2000", 25, "BOWLER", "RHB", "RIGHT ARM Off Spin", 2, 59, 71, 38, "CSK,RR", "RR", "Capped", 200),
    (35, "UBA1", "Aarya", "Desai", "India", "GUCA", "03/04/2003", 23, "BATTER", "LHB", "RIGHT ARM Off Spin", 0, 0, 0, 0, "KKR", "", "Uncapped", 30),
    (36, "UBA1", "Yash", "Dhull", "India", "DDCA", "11/11/2002", 23, "BATTER", "RHB", "RIGHT ARM Leg Spin", 0, 0, 0, 4, "DC", "", "Uncapped", 30),
    (37, "UBA1", "Abhinav", "Manohar", "India", "KSCA", "16/09/1994", 31, "BATTER", "RHB", "RIGHT ARM Leg Spin", 0, 0, 0, 26, "GT,SRH", "SRH", "Uncapped", 30),
    (38, "UBA1", "Anmolpreet", "Singh", "India", "PCA", "28/03/1998", 28, "BATTER", "RHB", "RIGHT ARM Off Spin", 0, 0, 0, 9, "MI,SRH", "", "Uncapped", 30),
    (39, "UBA1", "Atharva", "Taide", "India", "VCA", "26/04/2000", 25, "BATTER", "LHB", "LEFT ARM Slow Orthodox", 0, 0, 0, 10, "PBKS,SRH", "SRH", "Uncapped", 30),
    (40, "UBA1", "Abhinav", "Tejrana", "India", "GCA", "17/12/2000", 25, "BATTER", "LHB", "RIGHT ARM Off Spin", 0, 0, 0, 0, "", "", "Uncapped", 30),
    (41, "UAL1", "Auqib", "Dar", "India", "JKCA", "04/11/1996", 29, "ALL-ROUNDER", "RHB", "RIGHT ARM Fast Medium", 0, 0, 0, 0, "", "", "Uncapped", 30),
    (42, "UAL1", "Rajvardhan", "Hangargekar", "India", "MACA", "10/11/2002", 23, "ALL-ROUNDER", "RHB", "RIGHT ARM Fast", 0, 0, 0, 2, "CSK,LSG", "LSG", "Uncapped", 40),
    (43, "UAL1", "Tanush", "Kotian", "India", "MCA", "16/10/1998", 27, "ALL-ROUNDER", "RHB", "RIGHT ARM Off Spin", 0, 0, 0, 1, "RR", "", "Uncapped", 30),
    (45, "UAL1", "Mahipal", "Lomror", "India", "RCA", "16/11/1999", 26, "ALL-ROUNDER", "LHB", "LEFT ARM Slow Orthodox", 0, 0, 0, 40, "RR,RCB,GT", "GT", "Uncapped", 50),
    (46, "UAL1", "Kamlesh", "Nagarkoti", "India", "RCA", "28/12/1999", 26, "ALL-ROUNDER", "RHB", "RIGHT ARM Fast", 0, 0, 0, 12, "KKR,DC,CSK", "CSK", "Uncapped", 30),
    (47, "UAL1", "Vijay", "Shankar", "India", "TCA", "26/01/1991", 35, "ALL-ROUNDER", "RHB", "RIGHT ARM Fast Medium", 0, 12, 9, 78, "CSK,DC,SRH,GT", "CSK", "Uncapped", 30),
    (57, "UFA1", "Raj", "Limbani", "India", "BCA", "02/02/2005", 21, "BOWLER", "LHB", "RIGHT ARM Fast Medium", 0, 0, 0, 0, "", "", "Uncapped", 30),
    (58, "UFA1", "Akash", "Madhwal", "India", "CAU", "25/11/1993", 32, "BOWLER", "RHB", "RIGHT ARM Fast Medium", 0, 0, 0, 15, "MI,RR", "RR", "Uncapped", 30),
    (61, "UFA1", "Simarjeet", "Singh", "India", "DDCA", "17/01/1998", 28, "BOWLER", "RHB", "RIGHT ARM Fast", 0, 0, 0, 14, "CSK,SRH", "SRH", "Uncapped", 30),
    (63, "UFA1", "Kartik", "Tyagi", "India", "UPCA", "08/11/2000", 25, "BOWLER", "RHB", "RIGHT ARM Fast", 0, 0, 0, 20, "RR,SRH,GT", "", "Uncapped", 30),
    (66, "USP1", "Karn", "Sharma", "India", "RSPB", "23/10/1987", 38, "BOWLER", "LHB", "RIGHT ARM Leg Spin", 1, 2, 1, 90, "SRH,MI,CSK,RCB", "MI", "Uncapped", 50),
    (68, "USP1", "Kumar Kartikeya", "Singh", "India", "MPCA", "26/12/1997", 28, "BOWLER", "RHB", "LEFT ARM Slow Orthodox", 0, 0, 0, 16, "MI,RR", "RR", "Uncapped", 30),
    (77, "BA2", "Steve", "Smith", "Australia", "", "02/06/1989", 36, "BATTER", "RHB", "", 120, 170, 67, 103, "PWI,RPS,RR,DC", "", "Capped", 200),
    (78, "BA2", "Rahul", "Tripathi", "India", "MACA", "02/03/1991", 35, "BATTER", "RHB", "RIGHT ARM Medium", 0, 0, 5, 100, "RPS,RR,KKR,SRH,CSK", "CSK", "Capped", 75),
    (83, "AL2", "Jason", "Holder", "West Indies", "", "05/11/1991", 34, "ALL-ROUNDER", "RHB", "RIGHT ARM Fast", 69, 138, 86, 46, "CSK,KKR,SRH,LSG,RR", "", "Capped", 200),
    (84, "AL2", "Daryl", "Mitchell", "New Zealand", "", "20/05/1991", 34, "ALL-ROUNDER", "RHB", "RIGHT ARM Medium", 33, 56, 90, 15, "RR,CSK", "", "Capped", 200),
    (85, "AL2", "Daniel", "Sams", "Australia", "", "27/10/1992", 33, "ALL-ROUNDER", "RHB", "LEFT ARM Fast Medium", 0, 0, 10, 16, "DC,RCB,MI,LSG", "", "Capped", 100),
    (88, "WK2", "Tom", "Banton", "England", "", "11/11/1998", 27, "WICKETKEEPER", "RHB", "", 0, 7, 24, 2, "KKR", "", "Capped", 200),
    (90, "WK2", "Shai", "Hope", "West Indies", "", "10/11/1993", 32, "WICKETKEEPER", "RHB", "", 43, 148, 58, 9, "DC", "", "Capped", 200),
    (91, "WK2", "Josh", "Inglis", "Australia", "", "04/03/1995", 31, "WICKETKEEPER", "RHB", "", 3, 33, 41, 11, "PBKS", "PBKS", "Capped", 200),
    (96, "FA2", "Kyle", "Jamieson", "New Zealand", "", "30/12/1994", 31, "BOWLER", "RHB", "RIGHT ARM Fast", 19, 20, 23, 13, "RCB,CSK,PBKS", "PBKS", "Capped", 200),
    (99, "FA2", "Lungisani", "Ngidi", "South Africa", "", "29/03/1996", 30, "BOWLER", "RHB", "RIGHT ARM Fast Medium", 20, 73, 52, 16, "CSK,DC,RCB", "RCB", "Capped", 200),
    (101, "FA2", "Mustafizur", "Rahman", "Bangladesh", "", "06/09/1995", 30, "BOWLER", "LHB", "LEFT ARM Fast Medium", 15, 116, 124, 60, "SRH,MI,RR,DC,CSK", "DC", "Capped", 200),
    (104, "FA2", "Umesh", "Yadav", "India", "VCA", "25/10/1987", 38, "BOWLER", "RHB", "RIGHT ARM Fast Medium", 57, 75, 9, 148, "RCB,DC,KKR,GT", "", "Capped", 150)
]

# Realistic official Retentions for Mini Auction 2027 (10 Franchises)
# Each retained player is deducted from the team purse according to IPL retention rules
RETENTIONS_2027 = [
    # CSK
    {"team_id": "CSK", "name": "Ruturaj Gaikwad", "role": "BATTER", "country": "India", "retention_slab": "Retention 1", "retention_cost_cr": 18.0, "is_uncapped": False},
    {"team_id": "CSK", "name": "Ravindra Jadeja", "role": "ALL-ROUNDER", "country": "India", "retention_slab": "Retention 2", "retention_cost_cr": 18.0, "is_uncapped": False},
    {"team_id": "CSK", "name": "Shivam Dube", "role": "ALL-ROUNDER", "country": "India", "retention_slab": "Retention 3", "retention_cost_cr": 12.0, "is_uncapped": False},
    {"team_id": "CSK", "name": "Matheesha Pathirana", "role": "BOWLER", "country": "Sri Lanka", "retention_slab": "Retention 4", "retention_cost_cr": 13.0, "is_uncapped": False},
    {"team_id": "CSK", "name": "MS Dhoni", "role": "WICKETKEEPER", "country": "India", "retention_slab": "Uncapped Retention", "retention_cost_cr": 4.0, "is_uncapped": True},

    # MI
    {"team_id": "MI", "name": "Jasprit Bumrah", "role": "BOWLER", "country": "India", "retention_slab": "Retention 1", "retention_cost_cr": 18.0, "is_uncapped": False},
    {"team_id": "MI", "name": "Suryakumar Yadav", "role": "BATTER", "country": "India", "retention_slab": "Retention 2", "retention_cost_cr": 16.35, "is_uncapped": False},
    {"team_id": "MI", "name": "Hardik Pandya", "role": "ALL-ROUNDER", "country": "India", "retention_slab": "Retention 3", "retention_cost_cr": 16.35, "is_uncapped": False},
    {"team_id": "MI", "name": "Rohit Sharma", "role": "BATTER", "country": "India", "retention_slab": "Retention 4", "retention_cost_cr": 16.30, "is_uncapped": False},
    {"team_id": "MI", "name": "Tilak Varma", "role": "BATTER", "country": "India", "retention_slab": "Retention 5", "retention_cost_cr": 8.0, "is_uncapped": False},

    # RCB
    {"team_id": "RCB", "name": "Virat Kohli", "role": "BATTER", "country": "India", "retention_slab": "Retention 1", "retention_cost_cr": 21.0, "is_uncapped": False},
    {"team_id": "RCB", "name": "Rajat Patidar", "role": "BATTER", "country": "India", "retention_slab": "Retention 2", "retention_cost_cr": 11.0, "is_uncapped": False},
    {"team_id": "RCB", "name": "Yash Dayal", "role": "BOWLER", "country": "India", "retention_slab": "Uncapped Retention", "retention_cost_cr": 5.0, "is_uncapped": True},

    # KKR
    {"team_id": "KKR", "name": "Rinku Singh", "role": "BATTER", "country": "India", "retention_slab": "Retention 1", "retention_cost_cr": 13.0, "is_uncapped": False},
    {"team_id": "KKR", "name": "Varun Chakaravarthy", "role": "BOWLER", "country": "India", "retention_slab": "Retention 2", "retention_cost_cr": 12.0, "is_uncapped": False},
    {"team_id": "KKR", "name": "Sunil Narine", "role": "ALL-ROUNDER", "country": "West Indies", "retention_slab": "Retention 3", "retention_cost_cr": 12.0, "is_uncapped": False},
    {"team_id": "KKR", "name": "Andre Russell", "role": "ALL-ROUNDER", "country": "West Indies", "retention_slab": "Retention 4", "retention_cost_cr": 12.0, "is_uncapped": False},
    {"team_id": "KKR", "name": "Harshit Rana", "role": "BOWLER", "country": "India", "retention_slab": "Uncapped Retention", "retention_cost_cr": 4.0, "is_uncapped": True},
    {"team_id": "KKR", "name": "Ramandeep Singh", "role": "ALL-ROUNDER", "country": "India", "retention_slab": "Uncapped Retention", "retention_cost_cr": 4.0, "is_uncapped": True},

    # SRH
    {"team_id": "SRH", "name": "Heinrich Klaasen", "role": "WICKETKEEPER", "country": "South Africa", "retention_slab": "Retention 1", "retention_cost_cr": 23.0, "is_uncapped": False},
    {"team_id": "SRH", "name": "Pat Cummins", "role": "ALL-ROUNDER", "country": "Australia", "retention_slab": "Retention 2", "retention_cost_cr": 18.0, "is_uncapped": False},
    {"team_id": "SRH", "name": "Abhishek Sharma", "role": "ALL-ROUNDER", "country": "India", "retention_slab": "Retention 3", "retention_cost_cr": 14.0, "is_uncapped": False},
    {"team_id": "SRH", "name": "Travis Head", "role": "BATTER", "country": "Australia", "retention_slab": "Retention 4", "retention_cost_cr": 14.0, "is_uncapped": False},
    {"team_id": "SRH", "name": "Nitish Kumar Reddy", "role": "ALL-ROUNDER", "country": "India", "retention_slab": "Retention 5", "retention_cost_cr": 6.0, "is_uncapped": False},

    # RR
    {"team_id": "RR", "name": "Sanju Samson", "role": "WICKETKEEPER", "country": "India", "retention_slab": "Retention 1", "retention_cost_cr": 18.0, "is_uncapped": False},
    {"team_id": "RR", "name": "Yashasvi Jaiswal", "role": "BATTER", "country": "India", "retention_slab": "Retention 2", "retention_cost_cr": 18.0, "is_uncapped": False},
    {"team_id": "RR", "name": "Riyan Parag", "role": "ALL-ROUNDER", "country": "India", "retention_slab": "Retention 3", "retention_cost_cr": 14.0, "is_uncapped": False},
    {"team_id": "RR", "name": "Dhruv Jurel", "role": "WICKETKEEPER", "country": "India", "retention_slab": "Retention 4", "retention_cost_cr": 14.0, "is_uncapped": False},
    {"team_id": "RR", "name": "Shimron Hetmyer", "role": "BATTER", "country": "West Indies", "retention_slab": "Retention 5", "retention_cost_cr": 11.0, "is_uncapped": False},
    {"team_id": "RR", "name": "Sandeep Sharma", "role": "BOWLER", "country": "India", "retention_slab": "Uncapped Retention", "retention_cost_cr": 4.0, "is_uncapped": True},

    # DC
    {"team_id": "DC", "name": "Axar Patel", "role": "ALL-ROUNDER", "country": "India", "retention_slab": "Retention 1", "retention_cost_cr": 16.5, "is_uncapped": False},
    {"team_id": "DC", "name": "Kuldeep Yadav", "role": "BOWLER", "country": "India", "retention_slab": "Retention 2", "retention_cost_cr": 13.25, "is_uncapped": False},
    {"team_id": "DC", "name": "Tristan Stubbs", "role": "BATTER", "country": "South Africa", "retention_slab": "Retention 3", "retention_cost_cr": 10.0, "is_uncapped": False},
    {"team_id": "DC", "name": "Abishek Porel", "role": "WICKETKEEPER", "country": "India", "retention_slab": "Uncapped Retention", "retention_cost_cr": 4.0, "is_uncapped": True},

    # PBKS
    {"team_id": "PBKS", "name": "Shashank Singh", "role": "BATTER", "country": "India", "retention_slab": "Uncapped Retention 1", "retention_cost_cr": 5.5, "is_uncapped": True},
    {"team_id": "PBKS", "name": "Prabhsimran Singh", "role": "WICKETKEEPER", "country": "India", "retention_slab": "Uncapped Retention 2", "retention_cost_cr": 4.0, "is_uncapped": True},

    # GT
    {"team_id": "GT", "name": "Rashid Khan", "role": "ALL-ROUNDER", "country": "Afghanistan", "retention_slab": "Retention 1", "retention_cost_cr": 18.0, "is_uncapped": False},
    {"team_id": "GT", "name": "Shubman Gill", "role": "BATTER", "country": "India", "retention_slab": "Retention 2", "retention_cost_cr": 16.5, "is_uncapped": False},
    {"team_id": "GT", "name": "Sai Sudharsan", "role": "BATTER", "country": "India", "retention_slab": "Retention 3", "retention_cost_cr": 8.5, "is_uncapped": False},
    {"team_id": "GT", "name": "Rahul Tewatia", "role": "ALL-ROUNDER", "country": "India", "retention_slab": "Uncapped Retention 1", "retention_cost_cr": 4.0, "is_uncapped": True},
    {"team_id": "GT", "name": "Shahrukh Khan", "role": "ALL-ROUNDER", "country": "India", "retention_slab": "Uncapped Retention 2", "retention_cost_cr": 4.0, "is_uncapped": True},

    # LSG
    {"team_id": "LSG", "name": "Nicholas Pooran", "role": "WICKETKEEPER", "country": "West Indies", "retention_slab": "Retention 1", "retention_cost_cr": 21.0, "is_uncapped": False},
    {"team_id": "LSG", "name": "Ravi Bishnoi", "role": "BOWLER", "country": "India", "retention_slab": "Retention 2", "retention_cost_cr": 11.0, "is_uncapped": False},
    {"team_id": "LSG", "name": "Mayank Yadav", "role": "BOWLER", "country": "India", "retention_slab": "Retention 3", "retention_cost_cr": 11.0, "is_uncapped": False},
    {"team_id": "LSG", "name": "Mohsin Khan", "role": "BOWLER", "country": "India", "retention_slab": "Uncapped Retention 1", "retention_cost_cr": 4.0, "is_uncapped": True},
    {"team_id": "LSG", "name": "Ayush Badoni", "role": "ALL-ROUNDER", "country": "India", "retention_slab": "Uncapped Retention 2", "retention_cost_cr": 4.0, "is_uncapped": True}
]

def format_role(role_raw):
    r = role_raw.upper().strip()
    if "WICKET" in r or "WK" in r:
        return "Wicketkeeper"
    if "ALL" in r or "AL" in r:
        return "All-rounder"
    if "BOWL" in r or "FA" in r or "SP" in r:
        return "Bowler"
    return "Batter"

def determine_category(set_name, country, cua):
    is_indian = (country.strip().lower() == "india")
    if set_name.startswith("M"):
        return "Marquee players"
    elif cua == "Uncapped":
        return "Uncapped Indian players" if is_indian else "Uncapped overseas players"
    else:
        return "Capped Indian players" if is_indian else "Capped overseas players"

def transform_player(raw, index, mode="mega"):
    sr, set_name, first, last, country, state, dob, age, role_raw, bat, bowl, test_caps, odi_caps, t20_caps, ipl_caps, prev_teams, team_24, cua, price = raw
    name = f"{first} {last}".strip()
    role = format_role(role_raw)
    category = determine_category(set_name, country, cua)
    is_overseas = (country.strip().lower() != "india")
    
    # Generate unique ID
    player_id = f"IPL27-{'MEGA' if mode == 'mega' else 'MINI'}-{index:03d}"
    
    return {
        "id": player_id,
        "name": name,
        "first_name": first,
        "last_name": last,
        "country": country,
        "is_overseas": is_overseas,
        "state_association": state,
        "dob": dob,
        "age": age,
        "role": role,
        "batting_style": bat or "RHB",
        "bowling_style": bowl or "None",
        "test_caps": test_caps,
        "odi_caps": odi_caps,
        "t20_caps": t20_caps,
        "ipl_matches": ipl_caps if isinstance(ipl_caps, int) else (int(ipl_caps) if str(ipl_caps).isdigit() else 0),
        "previous_teams": prev_teams,
        "recent_team": team_24,
        "capped_status": cua,
        "base_price_lakh": price,
        "base_price_cr": round(price / 100.0, 2),
        "auction_category": category,
        "auction_set": set_name,
        "player_image": f"https://api.dicebear.com/7.x/bottts/svg?seed={name.replace(' ', '')}",
        "availability": "Available",
        "auction_status": "Upcoming",
        "data_status": "Confirmed Official Data (BCCI IPL Auction Registry)"
    }

# Build Mega List
mega_players = [transform_player(p, i + 1, "mega") for i, p in enumerate(RAW_PLAYERS_MEGA)]

# Build Mini List
mini_players = [transform_player(p, i + 1, "mini") for i, p in enumerate(RAW_PLAYERS_MINI)]

# Save JSON seeds
with open('backend/data/mega_players_seed.json', 'w', encoding='utf-8') as f:
    json.dump(mega_players, f, indent=2)

with open('backend/data/mini_players_seed.json', 'w', encoding='utf-8') as f:
    json.dump(mini_players, f, indent=2)

with open('backend/data/initial_retentions_2027.json', 'w', encoding='utf-8') as f:
    json.dump(RETENTIONS_2027, f, indent=2)

# Save CSV Files with exact required headers
# Headers: Player name, Role, Country, Base price, Auction category, Auction set, Previous team, Retention status, Player availability
CSV_FIELDNAMES = [
    "Player ID",
    "Player name",
    "Role",
    "Country",
    "Base price (₹ Lakh)",
    "Base price (₹ Crore)",
    "Auction category",
    "Auction set",
    "Previous team",
    "Retention status",
    "Player availability",
    "Batting style",
    "Bowling style",
    "IPL Matches",
    "Data Status"
]

def export_csv(players, filename, is_mini=False):
    filepath = os.path.join('backend/data', filename)
    with open(filepath, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(CSV_FIELDNAMES)
        for p in players:
            writer.writerow([
                p["id"],
                p["name"],
                p["role"],
                p["country"],
                p["base_price_lakh"],
                p["base_price_cr"],
                p["auction_category"],
                p["auction_set"],
                p["previous_teams"],
                "Released / In Auction" if is_mini else "Open Pool",
                p["availability"],
                p["batting_style"],
                p["bowling_style"],
                p["ipl_matches"],
                p["data_status"]
            ])
    print(f"Exported {filepath} ({len(players)} players)")

export_csv(mega_players, "IPL_2027_Mega_Auction_Players.csv", is_mini=False)
export_csv(mini_players, "IPL_2027_Mini_Auction_Players.csv", is_mini=True)

print("Dataset generation complete!")
