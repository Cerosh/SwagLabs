# SwagLabs
The effective design of automation tests is not just beneficial, but also of pivotal importance to their overall success. Before diving headfirst into the process of automation, it is paramount to clearly define the objective of the test at hand and understand its value within the framework of the overall testing strategy. A concentrated focus should be maintained on automating areas that are characterized by high impact, features that are frequently utilized, and sections that are particularly susceptible to regression. When it comes to designing your tests, they should be crafted as independent units, each one honing in on specific functionalities. This approach ensures that each function is thoroughly tested and any potential issues are highlighted effectively. Additionally, incorporating data-driven testing into your strategy can be incredibly beneficial. This method allows for the execution of the same test with varying data sets, which in turn, escalates the scope of coverage and enhances flexibility.

Contained within this repository is a selection of branches that demonstrate a transition from a state of no test design to one where diverse test designs have been implemented. This serves as a helpful tool to understand not only the advantages of test design but also the variety of strategies that can be utilized in this process. 

Outlined below are the user acceptance criteria that have been used to effectively communicate the proposed idea, along with the identified test cases. It should be noted that these cases have been penned down as a proof of concept. As a result, the test coverage part has been intentionally omitted in this instance.

Log in as `standard_user` or `visual_user`. Users can select items for checkout and, if necessary, remove or cancel the selected items. They can also add more items during the checkout process. However, they won't be able to complete the checkout without providing complete user information.

1. **Check out a random number of items.**
    
    Choose a random number of items, recording their name, price, and description. Verify these details in the cart. Proceed to the multi-step checkout, input user information, validate the overview, and confirm checkout to reach the completion page.
    
2. **Remove items from checkout.**
    
    Select a random number of items, noting down their names, prices, and descriptions. Cross-check these details in the cart. Finally, remove the items from checkout.
    
3. **Cancel the checkout.**
    
    Select random items, noting names, prices, and descriptions. Verify these in the cart. Proceed to multi-step checkout, input user information, but cancel instead of confirming. Ensure items remain in the cart.
    
4. **Add more items during checkout.**
    
    Select a random number of items, noting their name, price, and description. Confirm these details in the cart. Add additional items, then proceed to checkout. Enter the user information, verify the overview, and confirm the checkout process to arrive at the completion page.
    
5. **Cannot checkout without complete information.**
    
    Select random items, taking note of their names, prices, and descriptions. Then, confirm these items in the cart. Ensure that the user cannot proceed to checkout without providing all necessary information.
