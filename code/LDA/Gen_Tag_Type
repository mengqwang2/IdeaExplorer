import dataParse

def main():
    dp=dataParse.dataParse("../../data/ideas.txt")

    des1=dp.fieldParse("type_of_innovation")
    des2=dp.fieldParse("tags")

    f1 = open("../../data/other/type.txt","w+")
    for ele in des1:
        f1.write(unicode(ele).encode('utf-8')+',')
    f1.close()

    f2 = open("../../data/other/tag.txt","w+")
    for ele in des2:
        f2.write(unicode(ele).encode('utf-8')+',')
    f2.close()

if __name__ == '__main__':
    main()
