/**
 * Ti.JBChart (https://github.com/benbahrenburg/Ti.JBChart)
 *
 * Titanium code Copyright (c) 2009-2014 by Ben Bahrenburg. All Rights Reserved.
 * Licensed under the terms of the Apache 2.0 License
 * Please see the LICENSE included with this distribution for details.
 *
 * Ti.JBChart is a Titanium wrapper for JBChartView
 * for more information please visit https://github.com/Jawbone/JBChartView
 */

#import "TiJbchartBarChartViewProxy.h"
#import "TiUtils.h"
#import "TiJbchartBarChartView.h"

@implementation TiJbchartBarChartViewProxy

-(NSArray *)keySequence
{
    return [NSArray arrayWithObjects:
            @"barColors",
            @"data",
            @"toolTipData",
            @"selectionBarColor",
            @"barPadding",
            @"barCornerRadius",
            @"barCornerPosition",
            @"animateOnLoad",
            @"animateOnReload",
            @"barAnimationDuration",
            @"barAnimationStagger",
            @"cancelParentGestures",
            nil];
}


-(void)reloadData:(id)args
{
	ENSURE_SINGLE_ARG_OR_NIL(args, NSDictionary);
  	if ([self viewAttached])
	{
		TiThreadPerformOnMainThread(^{[(TiJbchartBarChartView*)[self view] reloadData:args];}, NO);
	}
}


@end
