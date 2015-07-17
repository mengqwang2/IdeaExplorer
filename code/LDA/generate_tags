import dataParse

def main():

    dp=dataParse.dataParse("../../data/ideas.txt")
    des=dp.fieldParse("tags")

    j = 0
    for item in des:
        f = open("../../data/document/tag"+str(j)+".txt","w")
        if item == '':
            item = 'NA'
        f.write(unicode(item).encode('utf-8'))
        j = j+1
    f.close()

if __name__ == '__main__':
    main()
