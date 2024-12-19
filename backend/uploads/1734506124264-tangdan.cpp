#include<bits/stdc++.h>
#include<vector> 
using namespace std;
int main(){
	int n;
	cin >>n;
	vector<int>a(n);
	for(int i=0; i<n;i++) cin>>a[i];
		vector<int>L(n,1);
		for(int i=0; i<n;i++){
			for(int j=0; j<n;j++){
				if(a[j]<a[i]){
					L[i]=max(L[i],L[j]+1);
				}
			}
		}
	cout<<*max_element(L.begin(),L.end())<<endl;
}
