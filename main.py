list = [1,2,3,4,5,5]

dictionary = {}

for i in range(len(list)):
    dictionary[list[i]] = dictionary.get(list[i], 0) + 1
    
for i in dictionary:
    if dictionary[i] > 1:
        print(i)
        break
else:
    print("N/A")
